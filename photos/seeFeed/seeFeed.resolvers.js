import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = (_, __, { loggedInUser }) => {
  return client.photo.findMany({
    where: {
      OR: [
        {
          user: {
            followers: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        },
        {
          userId: loggedInUser.id,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default {
  Query: {
    seeFeed: protectedResolver(resolverFn),
  },
};
