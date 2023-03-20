import client from "../../client";

export default {
  Query: {
    seeHashtag: async (__, { hashtag }) => {
      return client.hashtag.findUnique({
        where: {
          hashtag: hashtag,
        },
      });
    },
  },
};
