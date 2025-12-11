import { useNavigate } from "react-router-dom"
import { MessageSquarePlusIcon } from "lucide-react"
import { toast } from "sonner"
import { ChatInputBox } from "../components/chat-input-box"
import { ModelSelector } from "../components/model-selector"
import { useSelectedModel } from "../hooks/use-selected-model"
import { useCreateChatMutation } from "../data/queries/chats"
import { getErrorMessage } from "../lib/error-utils"

export function NewChatPage() {
   const navigate = useNavigate()
   const [selectedModel, setSelectedModel] = useSelectedModel()
   const createChatMutation = useCreateChatMutation()

   const handleSend = (content: string) => {
      createChatMutation.mutate(
         { content, model: selectedModel },
         {
            onSuccess: (data) => {
               navigate(`/chats/${data.chat.id}`)
            },
            onError: (error) => {
               toast.error("Failed to create chat", {
                  description: getErrorMessage(error),
               })
            },
         }
      )
   }

   return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto'>
         <div className='flex flex-col items-center gap-4 mb-8'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
               <MessageSquarePlusIcon className='h-8 w-8 text-primary' />
            </div>
            <h1 className='text-2xl font-semibold'>Start a new conversation</h1>
            <p className='text-muted-foreground text-center'>
               Select a model and type your message to begin chatting with the
               AI.
            </p>
         </div>

         <div className='w-full flex flex-col gap-4'>
            <div className='flex justify-center'>
               <ModelSelector
                  value={selectedModel}
                  onChange={setSelectedModel}
               />
            </div>
            <ChatInputBox
               onSend={handleSend}
               disabled={createChatMutation.isPending}
               placeholder='Start typing to create a new chat...'
            />
            {createChatMutation.isPending && (
               <p className='text-center text-sm text-muted-foreground'>
                  Creating chat...
               </p>
            )}
         </div>
      </div>
   )
}
