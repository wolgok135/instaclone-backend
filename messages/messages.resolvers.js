import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    //message도 위와 같이 해도 되지만, 아래와 같은 방법도 있고, 성능도 아래 방법이 나음.
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),

    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      } else {
        return client.message.count({
          where: {
            read: false,
            roomId: id,
            user: {
              id: {
                not: loggedInUser.id,
              },
            },
          },
        });
      }
    },
  },
  Message: {
    user: ({ id }) =>
      client.message
        .findUnique({
          where: {
            id: id,
          },
        })
        .user(),
  },
};
