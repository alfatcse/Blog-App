import { Mutation } from "./Mutation/Mutation";
import { Query } from "./Query/Query";
import { Post } from "./post";
import { User } from "./user";
import { Profile } from "./profile";
export const resolvers = {
  Profile,
  Query: Query,
  Mutation: Mutation,
  Post,
  User,
};
