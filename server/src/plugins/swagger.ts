import fp from "fastify-plugin"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"

export default fp(async (fastify) => {
   await fastify.register(swagger, {
      openapi: {
         info: {
            title: "Chat API",
            description: "LLM-powered chat API with Gemini integration",
            version: "1.0.0",
         },
         servers: [{ url: "http://localhost:8000" }],
         components: {
            securitySchemes: {
               authorization: {
                  type: "apiKey",
                  name: "Authorization",
                  in: "header",
                  description: "Enter user ID: richard, gilfoyle, or dinesh",
               },
            },
         },
         security: [{ authorization: [] }],
      },
   })

   await fastify.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
         docExpansion: "list",
         deepLinking: false,
         persistAuthorization: true,
      },
   })
})
