import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookie from "@fastify/cookie";
dotenv.config();

const app = fastify({ logger: true });
app.register(sensible);
app.register(cookie, { secret: process.env.Cookie_Secret });
app.register(cors, {});
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
    prisma.post
      .findUnique({
        where: { id: req.params.id },
        select: {
          body: true,
          title: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              ...COMMENT_SELECT_VARIABLES,
              _count: { select: { Like: true } },
            },
          },
        },
      })
      .then(async (post) => {
        const Like = await prisma.like.findMany({
          where: {
            userId: req.cookies.userId,
            commentId: { in: post.comments.map((comment) => comment.id) },
          },
        });
        return {
          ...post,
          comments: post.comments.map((comment) => {
            const { _count, ...commentFields } = comment;
            return {
              ...commentFields,
              likedByMe: Like.find((like) => like.commentId === comment.id),
              LikeCount: _count.Like,
            };
          }),
        };
      })
  );
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }
  return await comitToDb(
    prisma.comment
      .create({
        data: {
          message: req.body.message,
          userId: req.cookies.userId,
          parentId: req.body.parentId,
          postId: req.params.id,
        },
        select: COMMENT_SELECT_VARIABLES,
      })
      .then((comment) => {
        return {
          ...comment,
          LikeCount: 0,
          likedByMe: false,
        };
      })
  );
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }
  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookies.userId) {
    return res.send(
      app.httpErrors.unauthorized("you are not allowed to perform this action")
    );
  }
  return await comitToDb(
    prisma.comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true },
    })
  );
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookies.userId) {
    return res.send(
      app.httpErrors.unauthorized("you are not allowed to perform this action")
    );
  }
  return await comitToDb(
    prisma.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    })
  );
});

app.post("/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
  const data = {
    commentId: req.params.commentId,
    userId: req.cookies.userId,
  };
  const like = await prisma.like.findUnique({
    where: { userId_commentId: data },
  });
  if (like == null) {
    return await comitToDb(prisma.like.create({ data })).then(() => {
      return { addLike: true };
    });
  } else {
    return await comitToDb(
      prisma.like.delete({ where: { userId_commentId: data } })
    ).then(() => {
      return { addLike: false };
    });
  }
});

async function comitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

var port = process.env.PORT || 8080;
app.listen({ port }, (err, port) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Server is now listening on ${port}`);
  }
});
