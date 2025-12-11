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

export interface SendMessageInput {
   content: string
   model: string
}

export interface LLMMessage {
   role: "user" | "assistant"
   content: string
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

export interface LLMProvider {
   readonly name: string
   generateResponse(messages: LLMMessage[], model: string): Promise<string>
   generateTitle(content: string, model: string): Promise<string>
}

export type ProviderType = "gemini" | "openai" | "anthropic"

export interface ModelInfo {
   id: string
   name: string
   provider: ProviderType
}
