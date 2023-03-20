import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => {
      return client.user.findUnique({
        where: {
          id: userId,
        },
      });
    },

    hashtag: ({ id }) => {
      return client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id: id,
            },
          },
        },
      });
    },
  },

  Hashtag: {
    photos: ({ id }, { page }) => {
      return client.hashtag
        .findUnique({
          where: {
            id: id,
          },
        })
        .photos();
    },
    totalPhotos: ({ id }) => {
      return client.photo.count({
        where: {
          hashtag: {
            some: {
              id: id,
            },
          },
        },
      });
    },
  },
};
