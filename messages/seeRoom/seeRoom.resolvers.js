import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
  const room = await client.room.findFirst({
    where: {
      id: id,
      users: {
        some: {
          id: loggedInUser.id,
        },
      },
    },
  });
  return room;
};

export default {
  Query: {
    seeRoom: protectedResolver(resolverFn),
  },
};
