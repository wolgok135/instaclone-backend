import client from "../../client";

export default {
  Query: {
    seeFollowers: async (__, { userName, page }) => {
      const ok = await client.user.findUnique({
        where: {
          userName: userName,
        },
        select: {
          id: true,
        },
      });

      if (!ok) {
        return {
          ok: false,
          error: "Can't find user.",
        };
      }

      const followers = await client.user
        .findUnique({
          where: {
            userName: userName,
          },
        })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: {
              userName: userName,
            },
          },
        },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers.length / 5),
      };
      //console.log(aFollowers);
      /*  또 다른 방법... 
      const bFollowers = await client.user.findMany({
        where: {
          following: {
            some: {
              userName: userName,
            },
          },
        },
      });
      console.log(bFollowers);
      */
    },
  },
};
