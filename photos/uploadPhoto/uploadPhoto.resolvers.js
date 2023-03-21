import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtag } from "../photos.utils";

const resolverFn = async (__, { file, caption }, { loggedInUser }) => {
  let hashtagObjs = [];
  if (caption) {
    ///parse hashtag caption
    /*아래 함수는 regular expression이라고 해서.. 해시태그처럼 문장에서 
        특정 문자열을 추출해 낼 때, 정규표현식을 사용해서 추출해낼 수 있음. 
        regular expression은 따로 검색해서 작성방법을 찾아볼 것. 
        javascript에서는 String.match()함수 안에 parameter로 정규표현식을 넣으면 됨. */

    hashtagObjs = processHashtag(caption);
  }

  console.log(hashtagObjs);

  // get or create Hashtags
  return client.photo.create({
    data: {
      file: file,
      caption: caption,
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
      ...(hashtagObjs.length > 0 && {
        hashtag: {
          connectOrCreate: hashtagObjs,
        },
      }),
    },
  });

  // save the Photo WITH the parsed hashtags
  // add the photo to the hashtags
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};
