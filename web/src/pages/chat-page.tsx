import { useParams } from "react-router-dom"
import { useEffect, useRef } from "react"
import { ChatInputBox } from "../components/chat-input-box"
import { ModelSelector } from "../components/model-selector"
import {
   MessageContainer,
   MessageContent,
   AssistantLoadingIndicator,
} from "../components/message"
import { useSelectedModel } from "../hooks/use-selected-model"
import {
   useChatQuery,
   useMessagesQuery,
   useSendMessageMutation,
} from "../data/queries/chats"
import { ScrollArea } from "../components/ui/scroll-area"
import { Skeleton } from "../components/ui/skeleton"

export function ChatPage() {
   const { chatId } = useParams<{ chatId: string }>()
   const [selectedModel, setSelectedModel] = useSelectedModel()
   const messagesEndRef = useRef<HTMLDivElement>(null)

   const { data: chat, isLoading: isChatLoading } = useChatQuery(chatId)
   const { data: messages = [], isLoading: isMessagesLoading } =
      useMessagesQuery(chatId)
   const sendMessageMutation = useSendMessageMutation(chatId!)

   const handleSend = (content: string) => {
      sendMessageMutation.mutate({ content, model: selectedModel })
   }

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
   }, [messages, sendMessageMutation.isPending])

   if (isChatLoading || isMessagesLoading) {
      return (
         <div className='flex flex-col gap-4 max-w-4xl mx-auto'>
            <Skeleton className='h-8 w-48' />
            <div className='flex flex-col gap-4'>
               <Skeleton className='h-20 w-full' />
               <Skeleton className='h-20 w-3/4 ml-auto' />
               <Skeleton className='h-20 w-full' />
            </div>
         </div>
      )
   }

   return (
      <div className='flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto'>
         <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl font-semibold truncate'>{chat?.title}</h1>
            <ModelSelector value={selectedModel} onChange={setSelectedModel} />
         </div>

         <ScrollArea className='flex-1 pr-4'>
            <div className='flex flex-col gap-4 pb-4'>
               {messages.map((message) => (
                  <MessageContainer key={message.id} role={message.role}>
                     <MessageContent content={message.content} />
                  </MessageContainer>
               ))}
               {sendMessageMutation.isPending && <AssistantLoadingIndicator />}
               <div ref={messagesEndRef} />
            </div>
         </ScrollArea>

         <div className='pt-4 border-t'>
            <ChatInputBox
               onSend={handleSend}
               disabled={sendMessageMutation.isPending}
            />
         </div>
      </div>
   )
}
