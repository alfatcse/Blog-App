// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array ab ove.
export const resolvers = {
  Query: {},
  Mutation: {
    signup: (parent: any, args: any, context: any) => {
      console.log(args);
    },
  },
};
