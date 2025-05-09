import { useEffect, useState } from "react";
import type { Post } from "../../types/post";

const STORAGE_KEY = "localPosts";

export function useLocalPosts() {
  const [localPosts, setLocalPosts] = useState<Post[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(localPosts));
  }, [localPosts]);

  const addLocalPost = (post: Post) => {
    setLocalPosts((prev) => [post, ...prev]);
  };

  return { localPosts, addLocalPost };
}
