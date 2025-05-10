import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { fetchResource } from "../fetchResource";
import {
  GET_POSTS,
  GET_POST,
  GET_USER,
  GET_COMMENTS_FOR_POST,
} from "./queryKeys";
import type { Post } from "../../types/post";
import type { User } from "../../types/user";
import type { Comment } from "../../types/comment";

export function usePosts(options?: UseQueryOptions<Post[], Error>) {
  return useQuery<Post[], Error>({
    queryKey: GET_POSTS,
    queryFn: async () => (await fetchResource<Post[]>("/posts")).flat(),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...options,
  });
}

export function usePost(
  postId: number,
  options?: Omit<UseQueryOptions<Post, Error>, "queryKey" | "queryFn">
) {
  const qc = useQueryClient();
  return useQuery<Post, Error>({
    queryKey: GET_POST(postId),
    queryFn: async () => {
      const allPosts = qc.getQueryData<Post[]>(GET_POSTS) || [];
      const local = allPosts.find((p) => p.id === postId);
      if (local) {
        return local;
      }
      const res = await apiClient.get<Post>(`/posts/${postId}`);
      return res.data;
    },
    staleTime: 300_000,
    gcTime: 15 * 60_000,
    ...options,
  });
}

export function useUser(
  userId: number,
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">
) {
  return useQuery<User, Error>({
    queryKey: GET_USER(userId),
    queryFn: () =>
      apiClient.get<User>(`/users/${userId}`).then((res) => res.data),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60_000,
    ...options,
  });
}

export function useComments(
  postId: number,
  options?: UseQueryOptions<Comment[], Error>
) {
  return useQuery<Comment[], Error>({
    queryKey: GET_COMMENTS_FOR_POST(postId),
    queryFn: () =>
      apiClient
        .get<Comment[]>(`/posts/${postId}/comments`)
        .then((res) => res.data),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    ...options,
  });
}
