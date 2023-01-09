import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const Raj = await prisma.user.create({
    data: { name: "Raj" },
  });
  const Suraj = await prisma.user.create({
    data: { name: "Suraj" },
  });

  const post1 = await prisma.post.create({
    data: {
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      title: "post 1",
    },
  });
  const post2 = await prisma.post.create({
    data: {
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      title: "post 2",
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      message: "I am a root comment",
      userId: Raj.id,
      postId: post1.id,
    },
  });
  const comment2 = await prisma.comment.create({
    data: {
      parentId: comment1.id,
      message: "I am a nested comment",
      userId: Suraj.id,
      postId: post1.id,
    },
  });
  const comment3 = await prisma.comment.create({
    data: {
      parentId: comment2.id,
      message: "I am a root comment",
      userId: Suraj.id,
      postId: post1.id,
    },
  });
  const comment4 = await prisma.comment.create({
    data: {
      parentId: comment2.id,
      message: "I am a root comment",
      userId: Suraj.id,
      postId: post2.id,
    },
  });
}

seed();

// first run : npx prisma db push
// then run : npx prisma db seed
