export default {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (__, { id }) => client.movie.findUnique({ where: { id } }),
  },
};
