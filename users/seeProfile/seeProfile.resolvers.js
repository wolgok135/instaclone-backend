import client from "../../client";

export default {
  Query: {
    seeProfile: (__, { userName }) =>
      client.user.findUnique({
        where: {
          userName: userName,
        },
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};
