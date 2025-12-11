import { GoogleGenerativeAI } from "@google/generative-ai"
import { LLMMessage, LLMProvider } from "../../types"
import { mapModelName } from "./llm-factory"

const apiKey = process.env.GEMINI_API_KEY || ""
if (apiKey) {
   console.log(`[Gemini] API key loaded: ${apiKey.length} characters`)
   console.log(`[Gemini] API key prefix: ${apiKey.substring(0, 5)}...`)
} else {
   console.warn(
      "[Gemini] No API key found in GEMINI_API_KEY environment variable"
   )
}

const genAI = new GoogleGenerativeAI(apiKey)

const SYSTEM_PROMPT = `You are an AI assistant in a chat application. 
When the user asks for a "project plan", "workstreams", "deliverables", or anything similar:
- Output the plan inside a JSON structured object.
- Wrap that JSON inside a fenced code block marked as \`\`\`project-plan.

Example format:

\`\`\`project-plan
{
  "workstreams": [
    {
      "title": "Example Workstream",
      "description": "Short description.",
      "deliverables": [
        { "title": "Deliverable A", "description": "..." }
      ]
    }
  ]
}
\`\`\``

export class GeminiProvider implements LLMProvider {
   readonly name = "gemini"

   async generateResponse(
      messages: LLMMessage[],
      model: string
   ): Promise<string> {
      const geminiModel = mapModelName(model)
      console.log(`[Gemini] Using model: ${geminiModel}`)

      const generativeModel = genAI.getGenerativeModel({
         model: geminiModel,
         systemInstruction: SYSTEM_PROMPT,
      })

      const history = messages.slice(0, -1).map((msg) => ({
         role: msg.role === "user" ? "user" : "model",
         parts: [{ text: msg.content }],
      }))

      const lastMessage = messages[messages.length - 1]

      const chat = generativeModel.startChat({
         history: history as any,
      })

      const result = await chat.sendMessage(lastMessage.content)
      return result.response.text()
   }

   async generateTitle(content: string, model: string): Promise<string> {
      const geminiModel = mapModelName(model)
      const generativeModel = genAI.getGenerativeModel({ model: geminiModel })

      const prompt = `Generate a very short title (maximum 5 words) for a chat that starts with this message. Only respond with the title, nothing else:\n\n"${content}"`

      const result = await generativeModel.generateContent(prompt)
      const title = result.response.text().trim()
      return title.slice(0, 50)
   }
}
