import client from "../../client";

export default {
  Query: {
    seePhotoComments: async (_, { id }) => {
      const comments = await client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return comments;
    },
  },
};
