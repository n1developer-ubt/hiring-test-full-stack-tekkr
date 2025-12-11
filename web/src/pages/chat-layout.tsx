import { Outlet, useNavigate } from "react-router-dom"
import { Navbar } from "../components/navbar"
import { ChatSidebar } from "../components/chat-sidebar"
import { useChatsQuery } from "../data/queries/chats"

export function ChatLayout() {
   const navigate = useNavigate()
   const { data: chats = [] } = useChatsQuery()

   const handleCreateChat = () => {
      navigate("/")
   }

   return (
      <div className='flex flex-col min-h-screen'>
         <Navbar />
         <div className='flex flex-1'>
            <ChatSidebar chats={chats} onCreateChat={handleCreateChat} />
            <main className='flex-1 ml-64 p-8'>
               <Outlet />
            </main>
         </div>
      </div>
   )
}
