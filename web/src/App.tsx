import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ChatLayout } from "./pages/chat-layout"
import { NewChatPage } from "./pages/new-chat-page"
import { ChatPage } from "./pages/chat-page"

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 1000 * 60,
         refetchOnWindowFocus: false,
      },
   },
})

const router = createBrowserRouter([
   {
      path: "/",
      element: <ChatLayout />,
      children: [
         {
            index: true,
            element: <NewChatPage />,
         },
         {
            path: "chats/:chatId",
            element: <ChatPage />,
         },
      ],
   },
])

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <RouterProvider router={router} />
         <ReactQueryDevtools />
      </QueryClientProvider>
   )
}

export default App
