import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
const prisma = new PrismaClient();
interface userInfo {
  name: string;
  email: string;
  password: string;
}
export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: userInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      const token = Jwt.sign({ userId: newUser.id }, "signature", {
        expiresIn: "1d",
      });
      return { token };
    },
    signIn: async (parent: any, args: any, context: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });
      if (!user) {
        return {
          token: null,
        };
      }
      const correctPass = await bcrypt.compare(args.password, user.password);
      console.log(correctPass);
      if (!correctPass) {
        return {
          token: null,
        };
      }
    },
  },
};
