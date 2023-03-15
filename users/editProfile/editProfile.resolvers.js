import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

const resolverFn = async (
  __,
  { firstName, lastName, userName, email, password: newPassword, bio },
  { loggedInUser }
) => {
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      userName,
      email,
      bio,
      //ugly password가 있으면 password를 uglyPassword로 바꿔준다...
      //이건 ...(spread syntax)문법이 잘 이해가 안감...
      // 강의는 #4.7임. 다시 확인해볼 것...
      ...(uglyPassword && { password: uglyPassword }),
    },
  });

  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
