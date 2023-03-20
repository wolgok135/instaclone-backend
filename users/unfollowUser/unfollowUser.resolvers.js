import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, { userName }, { loggedInUser }) => {
  const ok = await client.user.findUnique({
    where: {
      userName: userName,
    },
  });

  if (!ok) {
    return {
      ok: false,
      error: "User does not exist.",
    };
  }

  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        disconnect: {
          userName: userName,
        },
      },
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    unfollowUser: protectedResolver(resolverFn),
  },
};
