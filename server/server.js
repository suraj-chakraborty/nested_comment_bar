import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookie from "@fastify/cookie";
dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cookie, { secret: process.env.Cookie_Secret });
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});
app.addHook("onRequest", (req, res, done) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    req.cookies.userId = CURRENT_USER_ID;
    res.clearCookie("userId");
    res.setCookie("userId", CURRENT_USER_ID);
  }
  done();
});

const COMMENT_SELECT_VARIABLES = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

const prisma = new PrismaClient();
const CURRENT_USER_ID = (
  await prisma.user.findFirst({
    where: { name: "Suraj" },
  })
).id;

app.get("/posts", async (req, res) => {
  return await comitToDb(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});
app.get("/posts/:id", async (req, res) => {
  return await comitToDb(
    prisma.post.findUnique({
      where: { id: req.params.id },
      select: {
        body: true,
        title: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: COMMENT_SELECT_VARIABLES,
        },
      },
    })
  );
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }
  return await comitToDb(
    prisma.comment.create({
      data: {
        message: req.body.message,
        userId: req.cookies.userId,
        parentId: req.body.parentId,
        postId: req.params.id,
      },
      select: COMMENT_SELECT_VARIABLES,
    })
  );
});

async function comitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen({ port: process.env.PORT }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
