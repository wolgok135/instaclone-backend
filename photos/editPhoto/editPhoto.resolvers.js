import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (__, { id, caption }, { loggedInUser }) => {
  const ok = await client.photo.findFirst({
    where: {
      id: id,
      userId: loggedInUser.id,
    },
  });

  if (!ok) {
    return {
      ok: false,
      error: "can't find photo or you are not owner of this photo",
    };
  } else {
    const photo = await client.photo.update({
      where: {
        id: id,
      },
      data: {
        caption: caption,
      },
    });

    return {
      ok: true,
    };
  }
};

export default {
  Mutation: {
    editPhoto: protectedResolver(resolverFn),
  },
};
