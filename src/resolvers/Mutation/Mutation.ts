import bcrypt from "bcrypt";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
interface userInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}
export const Mutation = {
  signup: async (parent: any, args: userInfo, { prisma }: any) => {
    console.log(prisma);
    const isExist = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });
    console.log("isexist::", isExist);
    if (isExist) {
      console.log("is exists");
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
  signIn: async (parent: any, args: any, { prisma }: any) => {
    console.log(prisma);
    const user = await prisma.user.findFirst({
      where: { email: args.email },
    });
    console.log(user);
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
};
