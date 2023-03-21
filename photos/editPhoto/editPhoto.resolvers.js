import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtag } from "../photos.utils";

const resolverFn = async (__, { id, caption }, { loggedInUser }) => {
  const oldPhoto = await client.photo.findFirst({
    where: {
      id: id,
      userId: loggedInUser.id,
    },
    include: {
      hashtag: {
        select: {
          hashtag: true,
        },
      },
    },
  });

  if (!oldPhoto) {
    return {
      ok: false,
      error: "can't find photo or you are not owner of this photo",
    };
  } else {
    await client.photo.update({
      where: {
        id: id,
      },
      data: {
        caption: caption,
        hashtag: {
          disconnect: oldPhoto.hashtag,
          connectOrCreate: processHashtag(caption),
        },
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
