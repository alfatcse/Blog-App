export const postResolvers = {
  addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    if (!post.title || !post.content) {
      return {
        userError: "Title and Content is required",
        post: null,
      };
    }
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.userId,
      },
    });
    return {
      userError: null,
      post: newPost,
    };
  },
  updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
    if (!user) {
      return {
        userError: "User Not found",
        post: null,
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: Number(args.postId),
      },
    });
    if (!post) {
      return {
        userError: "Post Not found",
        post: null,
      };
    }
    if (post.authorId !== user.id) {
      return {
        userError: "Post Not owned by user",
        post: null,
      };
    }
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: args.post,
    });
    console.log(updatedPost);
    return {
      userError: null,
      post: updatedPost,
    };
  },
};
