import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, __, { loggedInUser }) => {
  const rooms = await client.room.findMany({
    where: {
      users: {
        some: {
          id: loggedInUser.id,
        },
      },
    },
  });
  return rooms;
};
export default {
  Query: {
    seeRooms: protectedResolver(resolverFn),
  },
};
