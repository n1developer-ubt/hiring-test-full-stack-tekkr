import { FastifyPluginAsync } from "fastify"
import { v4 as uuidv4 } from "uuid"
import { storage } from "../../storage/in-memory"
import {
   getLLMProvider,
   isValidModel,
   getAllowedModelIds,
} from "../../services/llm/llm-factory"
import { Chat, Message, LLMMessage } from "../../types"

const chatSchema = {
   type: "object",
   properties: {
      id: { type: "string" },
      title: { type: "string" },
      createdAt: { type: "number" },
   },
}

const messageSchema = {
   type: "object",
   properties: {
      id: { type: "string" },
      chatId: { type: "string" },
      role: { type: "string", enum: ["user", "assistant"] },
      content: { type: "string" },
      createdAt: { type: "number" },
   },
}

const chatsRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
   fastify.get("/", {
      schema: {
         tags: ["Chats"],
         summary: "List all chats",
         response: {
            200: { type: "array", items: chatSchema },
         },
      },
      handler: async () => {
         return storage.getAllChats()
      },
   })

   fastify.post("/", {
      schema: {
         tags: ["Chats"],
         summary: "Create a new chat with first message",
         body: {
            type: "object",
            required: ["content", "model"],
            properties: {
               content: { type: "string", minLength: 1 },
               model: { type: "string", enum: getAllowedModelIds() },
            },
         },
         response: {
            201: {
               type: "object",
               properties: {
                  chat: chatSchema,
                  messages: { type: "array", items: messageSchema },
               },
            },
            400: { type: "object", properties: { error: { type: "string" } } },
            500: {
               type: "object",
               properties: {
                  error: { type: "string" },
                  details: { type: "string" },
               },
            },
         },
      },
      handler: async (request, reply) => {
         const { content, model } = request.body as {
            content: string
            model: string
         }

         if (!isValidModel(model)) {
            reply.status(400).send({
               error: `Invalid model. Allowed models: ${getAllowedModelIds().join(
                  ", "
               )}`,
            })
            return
         }

         const chatId = uuidv4()
         const chat: Chat = {
            id: chatId,
            title: "New Chat",
            createdAt: Date.now(),
         }
         storage.createChat(chat)

         const userMessage: Message = {
            id: uuidv4(),
            chatId,
            role: "user",
            content,
            createdAt: Date.now(),
         }
         storage.addMessage(userMessage)

         try {
            const llmProvider = getLLMProvider()

            const llmMessages: LLMMessage[] = [{ role: "user", content }]
            const assistantContent = await llmProvider.generateResponse(
               llmMessages,
               model
            )

            const assistantMessage: Message = {
               id: uuidv4(),
               chatId,
               role: "assistant",
               content: assistantContent,
               createdAt: Date.now(),
            }
            storage.addMessage(assistantMessage)

            try {
               const generatedTitle = await llmProvider.generateTitle(
                  content,
                  model
               )
               storage.updateChatTitle(chatId, generatedTitle)
               chat.title = generatedTitle
            } catch {
               const fallbackTitle =
                  content.slice(0, 50) + (content.length > 50 ? "..." : "")
               storage.updateChatTitle(chatId, fallbackTitle)
               chat.title = fallbackTitle
            }

            reply
               .status(201)
               .send({ chat, messages: [userMessage, assistantMessage] })
         } catch (error) {
            storage.deleteChat(chatId)
            fastify.log.error(error)
            reply.status(500).send({
               error: "Failed to get response from LLM",
               details:
                  error instanceof Error ? error.message : "Unknown error",
            })
         }
      },
   })

   fastify.get<{ Params: { id: string } }>("/:id", {
      schema: {
         tags: ["Chats"],
         summary: "Get a specific chat",
         params: {
            type: "object",
            required: ["id"],
            properties: {
               id: { type: "string" },
            },
         },
         response: {
            200: chatSchema,
            404: { type: "object", properties: { error: { type: "string" } } },
         },
      },
      handler: async (request, reply) => {
         const { id } = request.params
         const chat = storage.getChat(id)

         if (!chat) {
            reply.status(404).send({ error: "Chat not found" })
            return
         }

         return chat
      },
   })

   fastify.delete<{ Params: { id: string } }>("/:id", {
      schema: {
         tags: ["Chats"],
         summary: "Delete a chat",
         params: {
            type: "object",
            required: ["id"],
            properties: {
               id: { type: "string" },
            },
         },
         response: {
            204: { type: "null" },
            404: { type: "object", properties: { error: { type: "string" } } },
         },
      },
      handler: async (request, reply) => {
         const { id } = request.params
         const deleted = storage.deleteChat(id)

         if (!deleted) {
            reply.status(404).send({ error: "Chat not found" })
            return
         }

         reply.status(204).send()
      },
   })

   fastify.get<{ Params: { id: string } }>("/:id/messages", {
      schema: {
         tags: ["Messages"],
         summary: "Get all messages for a chat",
         params: {
            type: "object",
            required: ["id"],
            properties: {
               id: { type: "string" },
            },
         },
         response: {
            200: { type: "array", items: messageSchema },
            404: { type: "object", properties: { error: { type: "string" } } },
         },
      },
      handler: async (request, reply) => {
         const { id } = request.params
         const chat = storage.getChat(id)

         if (!chat) {
            reply.status(404).send({ error: "Chat not found" })
            return
         }

         return storage.getMessages(id)
      },
   })

   fastify.post<{ Params: { id: string } }>("/:id/messages", {
      schema: {
         tags: ["Messages"],
         summary: "Send a message and get LLM response",
         params: {
            type: "object",
            required: ["id"],
            properties: {
               id: { type: "string" },
            },
         },
         body: {
            type: "object",
            required: ["content", "model"],
            properties: {
               content: { type: "string", minLength: 1 },
               model: { type: "string", enum: getAllowedModelIds() },
            },
         },
         response: {
            200: {
               type: "object",
               properties: {
                  userMessage: messageSchema,
                  assistantMessage: messageSchema,
               },
            },
            400: { type: "object", properties: { error: { type: "string" } } },
            404: { type: "object", properties: { error: { type: "string" } } },
            500: {
               type: "object",
               properties: {
                  error: { type: "string" },
                  details: { type: "string" },
               },
            },
         },
      },
      handler: async (request, reply) => {
         const { id } = request.params
         const { content, model } = request.body as {
            content: string
            model: string
         }

         if (!isValidModel(model)) {
            reply.status(400).send({
               error: `Invalid model. Allowed models: ${getAllowedModelIds().join(
                  ", "
               )}`,
            })
            return
         }

         const chat = storage.getChat(id)
         if (!chat) {
            reply.status(404).send({ error: "Chat not found" })
            return
         }

         const userMessage: Message = {
            id: uuidv4(),
            chatId: id,
            role: "user",
            content,
            createdAt: Date.now(),
         }
         storage.addMessage(userMessage)

         try {
            const allMessages = storage.getMessages(id)
            const llmMessages: LLMMessage[] = allMessages.map((msg) => ({
               role: msg.role,
               content: msg.content,
            }))

            const llmProvider = getLLMProvider()
            const assistantContent = await llmProvider.generateResponse(
               llmMessages,
               model
            )

            const assistantMessage: Message = {
               id: uuidv4(),
               chatId: id,
               role: "assistant",
               content: assistantContent,
               createdAt: Date.now(),
            }
            storage.addMessage(assistantMessage)

            return { userMessage, assistantMessage }
         } catch (error) {
            fastify.log.error(error)
            reply.status(500).send({
               error: "Failed to get response from LLM",
               details:
                  error instanceof Error ? error.message : "Unknown error",
            })
         }
      },
   })
}

export default chatsRoutes
