export interface Chat {
   id: string
   title: string
   createdAt: number
}

export interface Message {
   id: string
   chatId: string
   role: "user" | "assistant"
   content: string
   createdAt: number
}

export interface ModelInfo {
   id: string
   name: string
   provider: string
}

export interface CreateChatRequest {
   content: string
   model: string
}

export interface CreateChatResponse {
   chat: Chat
   messages: Message[]
}

export interface SendMessageRequest {
   content: string
   model: string
}

export interface SendMessageResponse {
   userMessage: Message
   assistantMessage: Message
}

export interface ProjectPlan {
   workstreams: Workstream[]
}

export interface Workstream {
   title: string
   description: string
   deliverables?: Deliverable[]
}

export interface Deliverable {
   title: string
   description: string
}
