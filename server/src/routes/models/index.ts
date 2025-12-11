import { FastifyPluginAsync } from "fastify"
import { getAvailableModels } from "../../services/llm/llm-factory"

const modelsRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
   fastify.get("/", {
      schema: {
         tags: ["Models"],
         summary: "List available LLM models",
         response: {
            200: {
               type: "array",
               items: {
                  type: "object",
                  properties: {
                     id: { type: "string" },
                     name: { type: "string" },
                     provider: { type: "string" },
                  },
               },
            },
         },
      },
      handler: async () => {
         return getAvailableModels()
      },
   })
}

export default modelsRoutes
