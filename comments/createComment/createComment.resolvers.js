import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { photoId, payload }, { loggedInUser }) => {
  const ok = await client.photo.findUnique({
    where: {
      id: photoId,
    },
    select: {
      id: true,
    },
  });

  if (!ok) {
    return {
      ok: false,
      error: "photo not found",
    };
  }

  const newComment = await client.comment.create({
    data: {
      payload: payload,
      photo: {
        connect: {
          id: photoId,
        },
      },
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
    },
  });

  return {
    ok: true,
    id: newComment.id,
  };
};

export default {
  Mutation: {
    createComment: protectedResolver(resolverFn),
  },
};
