import { LLMProvider, ModelInfo } from "../../types"
import { GeminiProvider } from "./gemini"

// Available Gemini models - add new models here to make them available in the API
export const availableModels: ModelInfo[] = [
   {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      provider: "gemini",
   },
   { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "gemini" },
   {
      id: "gemini-2.5-flash-lite",
      name: "Gemini 2.5 Flash Lite",
      provider: "gemini",
   },
]

// Map frontend model IDs to actual Gemini API model names
const modelApiNameMap: Record<string, string> = {
   "gemini-2.5-flash": "gemini-2.5-flash",
   "gemini-2.5-pro": "gemini-2.5-pro",
   "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
}

// Cached Gemini provider instance
let geminiProvider: LLMProvider | null = null

// Factory function to get the Gemini LLM provider
export function getLLMProvider(): LLMProvider {
   if (!geminiProvider) {
      geminiProvider = new GeminiProvider()
   }
   return geminiProvider
}

// Get list of available models
export function getAvailableModels(): ModelInfo[] {
   return availableModels
}

// Validate if a model ID is allowed
export function isValidModel(modelId: string): boolean {
   return availableModels.some((m) => m.id === modelId)
}

// Get allowed model IDs for validation schema
export function getAllowedModelIds(): string[] {
   return availableModels.map((m) => m.id)
}

// Map model ID to Gemini API model name
export function mapModelName(model: string): string {
   return modelApiNameMap[model] || "gemini-2.5-flash-lite"
}
