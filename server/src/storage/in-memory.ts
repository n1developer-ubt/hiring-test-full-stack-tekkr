import { Chat, Message } from "../types"

const chats: Map<string, Chat> = new Map()
const messages: Map<string, Message[]> = new Map()

export function createChat(chat: Chat): Chat {
   chats.set(chat.id, chat)
   messages.set(chat.id, [])
   return chat
}

export function getChat(chatId: string): Chat | undefined {
   return chats.get(chatId)
}

export function getAllChats(): Chat[] {
   return Array.from(chats.values()).sort((a, b) => b.createdAt - a.createdAt)
}

export function deleteChat(chatId: string): boolean {
   const deleted = chats.delete(chatId)
   messages.delete(chatId)
   return deleted
}

export function updateChatTitle(
   chatId: string,
   title: string
): Chat | undefined {
   const chat = chats.get(chatId)
   if (chat) {
      chat.title = title
      chats.set(chatId, chat)
   }
   return chat
}

export function addMessage(message: Message): Message {
   const chatMessages = messages.get(message.chatId) || []
   chatMessages.push(message)
   messages.set(message.chatId, chatMessages)
   return message
}

export function getMessages(chatId: string): Message[] {
   return messages.get(chatId) || []
}

export const storage = {
   createChat,
   getChat,
   getAllChats,
   deleteChat,
   updateChatTitle,
   addMessage,
   getMessages,
}
