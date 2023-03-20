import client from "../../client";

export default {
  Query: {
    seeFollowing: async (__, { userName, lastCursorId }) => {
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
          error: "Can't find user",
        };
      }

      const following = await client.user
        .findUnique({ where: { userName: userName } })
        .following({
          take: 5,
          skip: lastCursorId ? 1 : 0,
          //아니면 아래처럼 해도 됨
          //...(lastCursorId && { skip: 1 }),

          ...(lastCursorId && { cursor: { id: lastCursorId } }),
          ///cursor가 null이 아니면, cursor: { id: cursor }를 반영하고,
          ///없으면 아무것도 없다는 뜻의 ES6문법이라함....
        });
      //console.log(following);

      return {
        ok: true,
        following,
      };
    },
  },
};
