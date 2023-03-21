import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id, payload }, { loggedInUser }) => {
  const comment = await client.comment.findUnique({
    where: {
      id: id,
    },
    select: {
      userId: true,
    },
  });

  if (!comment) {
    return {
      ok: false,
      error: "comment not found",
    };
  } else if (comment.userId !== loggedInUser.id) {
    return {
      ok: false,
      error: "not authorized, comment isn't yours",
    };
  }

  await client.comment.update({
    where: {
      id: id,
    },
    data: {
      payload: payload,
    },
  });

  return {
    ok: true,
  };
};

export default {
  Mutation: {
    editComment: protectedResolver(resolverFn),
  },
};
