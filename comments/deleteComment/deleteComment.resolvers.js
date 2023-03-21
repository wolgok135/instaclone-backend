import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
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
      error: "not authorized, comment is not yours",
    };
  }

  await client.comment.delete({
    where: {
      id: id,
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    deleteComment: protectedResolver(resolverFn),
  },
};
