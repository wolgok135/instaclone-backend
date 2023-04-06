import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        //토큰이 유효하지 않거나 없을 경우 null을 반환하고, 유효한 경우 resolverFunction을 실행함
        console.log("return null");

        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
}
