export const GET_POSTS = ["posts"] as const;
export const GET_POST = (postId: number) => [...GET_POSTS, postId] as const;
export const GET_USER = (userId: number) => ["users", userId] as const;
export const GET_COMMENTS_FOR_POST = (postId: number) =>
  [...GET_POST(postId), "comments"] as const;
