import fs, { createWriteStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import { uploadToS3 } from "../../shared/shared.utils";

const resolverFn = async (
  __,
  { firstName, lastName, userName, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");

    /*
    원래 작성했던 local server내 저장하는 코드는 아래에 주석으로 남겨둠...
    그리고 위와 같이 amazon s3에 업로드 하는 걸로 바꿈.. 돈 들텐데...

    const { filename, createReadStream } = await avatar;
    const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFileName
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFileName}`;
    */
  }

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
      ...(avatarUrl && { avatar: avatarUrl }),
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
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
