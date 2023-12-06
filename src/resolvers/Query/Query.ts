export const Query = {
  users: async (parent: any, args: any, { prisma }: any) => {
    console.log(prisma);
    return await prisma.user.findMany();
  },
};
