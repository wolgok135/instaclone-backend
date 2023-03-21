export const processHashtag = (caption) => {
  const hashtags = caption.match(/#[\w]+/g) || [];
  // 위는 정규표현식 결과가 null일 경우, empty array를 return하라는 의미임.
  return hashtags.map((hashtag) => ({
    where: { hashtag: hashtag },
    create: { hashtag: hashtag },
  }));
};
