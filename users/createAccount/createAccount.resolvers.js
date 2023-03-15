import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      __,
      { firstName, lastName, userName, email, password }
    ) => {
      try {
        // check if username or email are already on DB
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                email: email,
              },
              {
                userName: userName,
              },
            ],
          },
        });

        if (existingUser) {
          throw new Error("This username or email is aleady taken");
          //Error를 Throw하면 이후의 아래 코드는 실행 되지 않음
        }

        // hash password
        const uglyPassword = await bcrypt.hash(password, 10);

        // save and return the user

        return client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
      } catch (e) {
        return e;
      }
    },
  },
};
