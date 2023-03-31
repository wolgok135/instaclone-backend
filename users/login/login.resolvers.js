import client from "../../client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    login: async (__, { userName, password }) => {
      // find user with args.username
      console.log(userName);
      console.log(password);
      const user = await client.user.findFirst({
        where: { userName: userName },
      });
      if (!user) {
        return {
          ok: false,
          error: "cannot find user name",
        };
      }
      // check password with args.password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "password is not correct",
        };
      }
      // issue a token and send it to user
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token: token,
      };
    },
  },
};
