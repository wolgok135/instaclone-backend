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
    likes: ({ id }) => {
      return client.like.count({
        where: {
          photoId: id,
        },
      });
    },
    comments: ({ id }) => {
      return client.comment.count({
        where: {
          photoId: id,
        },
      });
    },
    isMine: async ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      //return userId === loggedInUser.id ? true : false;
      //굳이 위처럼 하지 않고 아래와 같이 작성해도 됨
      return userId === loggedInUser.id;
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
