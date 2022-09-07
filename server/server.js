import fastify from "fastify";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const app = fastify({});
const prisma = new PrismaClient();

app.get("/posts", async (req, res) => {
  return await prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  });
});

app.listen({ port: process.env.PORT }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
