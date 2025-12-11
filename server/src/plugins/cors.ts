import fp from "fastify-plugin"
import fastifyCors, { FastifyCorsOptions } from "@fastify/cors"

export default fp<FastifyCorsOptions>(async (fastify) => {
   fastify.register(fastifyCors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
})
