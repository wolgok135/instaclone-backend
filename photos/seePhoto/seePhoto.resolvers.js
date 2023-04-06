import client from "../../client";

export default {
  Query: {
    seePhoto: (__, { id }) => {
      const photo = client.photo.findUnique({
        where: {
          id: id,
        },
        include: {
          likes: true,
        },
      });
      return photo;
    },
  },
};
