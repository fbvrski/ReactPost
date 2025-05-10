import React from "react";
import { Link } from "react-router";
import { useUser } from "../../api/hooks/useJsonPlaceholder";
import type { Post } from "../../types/post";

type Props = { post: Post };

export const PostItem: React.FC<Props> = ({ post }) => {
  const { data: user, isLoading, isError } = useUser(post.userId);

  return (
    <Link
      to={`/posts/${post.id}`}
      className="
          cursor-pointer
          border border-gray-300 dark:border-gray-700
          rounded-lg
          overflow-hidden
          hover:shadow-lg
          transition-shadow
          duration-200
          bg-white dark:bg-gray-800
          hover:border-white
        "
    >
      <div>
        {isLoading ? (
          <div className="p-4 animate-pulse space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        ) : isError ? (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              Failed to load author
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {post.body.length > 100
                ? `${post.body.slice(0, 100)}…`
                : post.body}
            </p>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {user?.username || "Unknown user"} &middot;{" "}
              {user?.email || "No email"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {post.body.length > 100
                ? `${post.body.slice(0, 100)}…`
                : post.body}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};
