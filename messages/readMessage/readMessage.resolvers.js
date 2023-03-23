import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
  const message = await client.message.findFirst({
    where: {
      id: id,
      userId: {
        not: loggedInUser.id,
      },
      room: {
        users: {
          some: {
            id: loggedInUser.id,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!message) {
    return {
      ok: false,
      error: "message not fount",
    };
  }

  await client.message.update({
    where: {
      id: id,
    },
    data: {
      read: true,
    },
  });

  return {
    ok: true,
  };
};

export default {
  Mutation: {
    readMessage: protectedResolver(resolverFn),
  },
};
