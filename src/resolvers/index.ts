import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtHelper } from "../utils/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
const prisma = new PrismaClient();
interface userInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}
export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: userInfo, context: any) => {
      const isExist = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (isExist) {
        return {
          userError: "Email already exist",
          token: null,
        };
      }
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      if (args?.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: newUser.id,
          },
        });
      }
      const token = await jwtHelper(
        { userId: newUser.id },
        config.jwt.secret as Secret
      );
      return { userError: null, token };
    },
    signIn: async (parent: any, args: any, context: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });
      if (!user) {
        return {
          userError: "Email not found",
          token: null,
        };
      }
      const correctPass = await bcrypt.compare(args.password, user.password);
      if (!correctPass) {
        return {
          userError: "Password not matched",
          token: null,
        };
      }
      const token = jwtHelper({ userId: user.id }, config.jwt.secret as Secret);
      return {
        userError: null,
        token,
      };
    },
  },
};
