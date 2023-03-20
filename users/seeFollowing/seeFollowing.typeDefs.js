//// seeFollowers는 offset pagination으로 구현하고
//// seeFollwing은 cursor based pagination으로 구현
//// prisma.io document에서 prisma.client에서 pagination 문서 참고

import { gql } from "apollo-server";

export default gql`
  type SeeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
  }
  type Query {
    seeFollowing(userName: String!, lastCursorId: Int): SeeFollowingResult!
  }
`;
