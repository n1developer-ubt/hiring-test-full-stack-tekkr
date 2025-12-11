import axios from "axios"

export function getErrorMessage(error: unknown): string {
   if (axios.isAxiosError(error)) {
      const data = error.response?.data

      if (data?.details?.includes("quota")) {
         return "API quota exceeded. Please wait a moment and try again."
      }

      if (data?.details) {
         return data.details
      }

      if (data?.error) {
         return data.error
      }

      if (error.response?.status === 429) {
         return "Rate limit exceeded. Please wait a moment and try again."
      }

      if (error.response?.status === 500) {
         return "Server error. The AI service may be temporarily unavailable."
      }
   }

   if (error instanceof Error) {
      return error.message
   }

   return "An unexpected error occurred. Please try again."
}
