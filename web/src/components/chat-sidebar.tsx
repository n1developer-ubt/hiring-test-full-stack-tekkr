import { useState } from "react"
import { Button } from "./ui/button"
import { MessagesSquareIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Chat } from "../data/types"
import { useDeleteChatMutation } from "../data/queries/chats"
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "./ui/alert-dialog"

interface Props {
   chats: Chat[]
   onCreateChat?: () => void
}

export function ChatSidebar({ chats, onCreateChat }: Props) {
   const navigate = useNavigate()
   const { chatId } = useParams<{ chatId: string }>()
   const deleteChatMutation = useDeleteChatMutation()
   const [chatToDelete, setChatToDelete] = useState<Chat | null>(null)

   const handleSelectChat = (id: string) => {
      navigate(`/chats/${id}`)
   }

   const handleDeleteClick = (e: React.MouseEvent, chat: Chat) => {
      e.stopPropagation()
      e.preventDefault()
      setChatToDelete(chat)
   }

   const handleConfirmDelete = () => {
      if (!chatToDelete) return

      deleteChatMutation.mutate(chatToDelete.id, {
         onSuccess: () => {
            toast.success("Chat deleted")
            if (chatId === chatToDelete.id) {
               navigate("/")
            }
            setChatToDelete(null)
         },
         onError: (error) => {
            console.error("Delete failed:", error)
            toast.error("Failed to delete chat")
            setChatToDelete(null)
         },
      })
   }

   return (
      <>
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
                        onClick={(e) => handleDeleteClick(e, chat)}>
                        <Trash2Icon className='h-4 w-4 text-muted-foreground hover:text-destructive' />
                     </Button>
                  </div>
               ))}
            </div>
         </div>

         <AlertDialog
            open={!!chatToDelete}
            onOpenChange={(open) => !open && setChatToDelete(null)}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete "{chatToDelete?.title}"?
                     This action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleConfirmDelete}
                     className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                     {deleteChatMutation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   )
}
