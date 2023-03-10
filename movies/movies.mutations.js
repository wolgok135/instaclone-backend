import client from "../client";

export default {
  Mutation: {
    createMovie: (__, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (__, { id }) => client.movie.delete({ where: { id } }),
    updateMovie: (__, { id, year }) =>
      client.movie.update({ where: { id: id }, data: { year: year } }),
  },
};
