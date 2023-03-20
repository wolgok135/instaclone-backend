import client from "../../client";

export default {
  Query: {
    searchUsers: async (__, { keyword }) => {
      const users = await client.user.findMany({
        where: {
          userName: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });
      return users;
    },
  },
};
