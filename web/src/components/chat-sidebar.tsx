import { Button } from "./ui/button"
import { MessagesSquareIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Chat } from "../data/types"
import { useDeleteChatMutation } from "../data/queries/chats"

interface Props {
   chats: Chat[]
   onCreateChat?: () => void
}

export function ChatSidebar({ chats, onCreateChat }: Props) {
   const navigate = useNavigate()
   const { chatId } = useParams<{ chatId: string }>()
   const deleteChatMutation = useDeleteChatMutation()

   const handleSelectChat = (id: string) => {
      navigate(`/chats/${id}`)
   }

   const handleDeleteChat = (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      deleteChatMutation.mutate(id, {
         onSuccess: () => {
            if (chatId === id) {
               navigate("/")
            }
         },
      })
   }

   return (
      <div className='flex flex-col border-r-accent border-r-2 h-full w-64 fixed left-0 top-16 bottom-0 p-4 gap-3'>
         <Button onClick={onCreateChat} size='sm'>
            <PlusIcon className='w-5 h-5' />
            New Chat
         </Button>
         <hr />
         <div className='flex flex-col gap-1 overflow-y-auto'>
            {chats.map((chat) => (
               <div key={chat.id} className='group relative'>
                  <Button
                     variant={chatId === chat.id ? "secondary" : "ghost"}
                     size='sm'
                     className='w-full text-left justify-start pr-8'
                     onClick={() => handleSelectChat(chat.id)}>
                     <MessagesSquareIcon className='w-5 h-5 me-2 flex-shrink-0' />
                     <span className='truncate'>{chat.title}</span>
                  </Button>
                  <Button
                     variant='ghost'
                     size='icon'
                     className='absolute right-0 top-0 h-full w-8 opacity-0 group-hover:opacity-100 transition-opacity'
                     onClick={(e) => handleDeleteChat(e, chat.id)}>
                     <Trash2Icon className='h-4 w-4 text-muted-foreground hover:text-destructive' />
                  </Button>
               </div>
            ))}
         </div>
      </div>
   )
}
