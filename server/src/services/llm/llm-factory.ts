import { LLMProvider, ModelInfo, ProviderType } from "../../types"
import { GeminiProvider } from "./gemini"

type ProviderFactory = () => LLMProvider

const providerRegistry = new Map<ProviderType, ProviderFactory>([
   ["gemini", () => new GeminiProvider()],
   // Add new providers here:
   // ["openai", () => new OpenAIProvider()],
   // ["anthropic", () => new AnthropicProvider()],
])

// Cached provider instances
const providerInstances = new Map<ProviderType, LLMProvider>()

export const availableModels: ModelInfo[] = [
   // Gemini models
   { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "gemini" },
   { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "gemini" },
   {
      id: "gemini-2.5-flash-lite",
      name: "Gemini 2.5 Flash Lite",
      provider: "gemini",
   },

   // OpenAI models (uncomment when provider is added)
   // { id: "gpt-5", name: "GPT-5", provider: "openai" },
   // { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai" },
   // { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai" },

   // Anthropic models (uncomment when provider is added)
   // { id: "claude-4-opus", name: "Claude 4 Opus", provider: "anthropic" },
   // { id: "claude-4-sonnet", name: "Claude 4 Sonnet", provider: "anthropic" },
]

const modelApiNameMap: Record<string, string> = {
   // Gemini
   "gemini-2.5-flash": "gemini-2.5-flash",
   "gemini-2.5-pro": "gemini-2.5-pro",
   "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",

   // OpenAI (example)
   // "gpt-4": "gpt-4-0125-preview",
   // "gpt-4-turbo": "gpt-4-turbo-preview",
}

export function getProviderByType(providerType: ProviderType): LLMProvider {
   if (providerInstances.has(providerType)) {
      return providerInstances.get(providerType)!
   }

   const factory = providerRegistry.get(providerType)
   if (!factory) {
      throw new Error(`Provider "${providerType}" is not registered`)
   }

   const instance = factory()
   providerInstances.set(providerType, instance)
   return instance
}

export function getLLMProvider(modelId?: string): LLMProvider {
   if (modelId) {
      const model = availableModels.find((m) => m.id === modelId)
      if (model) {
         return getProviderByType(model.provider)
      }
   }
   return getProviderByType("gemini")
}

export function getAvailableModels(): ModelInfo[] {
   return availableModels
}

export function getModelsByProvider(providerType: ProviderType): ModelInfo[] {
   return availableModels.filter((m) => m.provider === providerType)
}

export function isValidModel(modelId: string): boolean {
   return availableModels.some((m) => m.id === modelId)
}

export function getAllowedModelIds(): string[] {
   return availableModels.map((m) => m.id)
}

export function mapModelName(model: string): string {
   return modelApiNameMap[model] || model
}

export function getModelInfo(modelId: string): ModelInfo | undefined {
   return availableModels.find((m) => m.id === modelId)
}

export function getRegisteredProviders(): ProviderType[] {
   return Array.from(providerRegistry.keys())
}
