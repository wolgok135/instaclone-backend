import client from "../client";

//여기서는 graphql 쿼리에 await를 안 붙였는데, 이건 graphql이 알아서 해주기 때문임.

export default {
  User: {
    totalFollowing: ({ id }) => {
      const count = client.user.count({
        where: {
          followers: {
            some: {
              id: id,
            },
          },
        },
      });
      return count;
    },

    totalFollowers: ({ id }) => {
      const count = client.user.count({
        where: {
          following: {
            some: {
              id: id,
            },
          },
        },
      });
      return count;
    },
    isMe: ({ id }, __, context) => {
      if (!context.loggedInUser) {
        return false;
      }
      /*
      if (id == context.loggedInUser.id) {
        return true;
      } else {
        return false;
      }
      이걸 더 간단하게 아래와 같이 입력
      */
      return id === context.loggedInUser.id;
    },
    isFollowing: async ({ id }, __, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      /*
      const exists = await client.user
        .findUnique({
          where: {
            userName: loggedInUser.userName,
          },
        })
        .following({
          where: {
            id: id,
          },
        });

      return exists.length !== 0;
      // 0이 아니면 true, 0이면 false
      */

      //위를 조금 더  간단하게...
      const exists = await client.user.count({
        where: {
          username: loggedInUser.userName,
          following: {
            some: {
              id: id,
            },
          },
        },
      });
      return Boolean(exists);
    },
    photos: ({ id }) => {
      return client.user
        .findUnique({
          where: {
            id: id,
          },
        })
        .photos();
    },
  },
};
