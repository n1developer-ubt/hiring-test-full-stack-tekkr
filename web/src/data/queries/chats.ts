import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../client"
import {
   Chat,
   Message,
   CreateChatRequest,
   CreateChatResponse,
   SendMessageRequest,
   SendMessageResponse,
} from "../types"

export const chatKeys = {
   all: ["chats"] as const,
   detail: (id: string) => ["chats", id] as const,
   messages: (chatId: string) => ["chats", chatId, "messages"] as const,
}

export function useChatsQuery() {
   return useQuery({
      queryKey: chatKeys.all,
      queryFn: async () => {
         const response = await apiClient.get<Chat[]>("/chats")
         return response.data
      },
   })
}

export function useChatQuery(chatId: string | undefined) {
   return useQuery({
      queryKey: chatKeys.detail(chatId!),
      queryFn: async () => {
         const response = await apiClient.get<Chat>(`/chats/${chatId}`)
         return response.data
      },
      enabled: !!chatId,
   })
}

export function useMessagesQuery(chatId: string | undefined) {
   return useQuery({
      queryKey: chatKeys.messages(chatId!),
      queryFn: async () => {
         const response = await apiClient.get<Message[]>(
            `/chats/${chatId}/messages`
         )
         return response.data
      },
      enabled: !!chatId,
   })
}

export function useCreateChatMutation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (data: CreateChatRequest) => {
         const response = await apiClient.post<CreateChatResponse>(
            "/chats",
            data
         )
         return response.data
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: chatKeys.all })
         queryClient.setQueryData(chatKeys.detail(data.chat.id), data.chat)
         queryClient.setQueryData(
            chatKeys.messages(data.chat.id),
            data.messages
         )
      },
   })
}

export function useSendMessageMutation(chatId: string) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (data: SendMessageRequest) => {
         const response = await apiClient.post<SendMessageResponse>(
            `/chats/${chatId}/messages`,
            data
         )
         return response.data
      },
      onSuccess: (data) => {
         queryClient.setQueryData<Message[]>(
            chatKeys.messages(chatId),
            (oldMessages) => {
               if (!oldMessages)
                  return [data.userMessage, data.assistantMessage]
               return [...oldMessages, data.userMessage, data.assistantMessage]
            }
         )
         queryClient.invalidateQueries({ queryKey: chatKeys.all })
      },
   })
}

export function useDeleteChatMutation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (chatId: string) => {
         await apiClient.delete(`/chats/${chatId}`)
         return chatId
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: chatKeys.all })
      },
   })
}
