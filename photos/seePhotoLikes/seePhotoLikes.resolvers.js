import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (__, { id }) => {
      const like = await client.like.findMany({
        where: {
          photoId: id,
        },

        select: {
          user: true,
        },
      });

      return like.map((like) => like.user);
    },
  },
};
