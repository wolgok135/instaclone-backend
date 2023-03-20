import client from "../../client";

export default {
  Query: {
    searchPhotos: (__, { keyword }) => {
      return client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
      });
    },
  },
};
