import { useState, useEffect } from "react"

const STORAGE_KEY = "selected-model"
const DEFAULT_MODEL = "gemini-2.5-flash"

export function useSelectedModel() {
   const [model, setModel] = useState<string>(() => {
      if (typeof window !== "undefined") {
         return localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL
      }
      return DEFAULT_MODEL
   })

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, model)
   }, [model])

   return [model, setModel] as const
}
