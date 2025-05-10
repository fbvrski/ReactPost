import { useParams, Link } from "react-router";
import { ArrowLeft, Mail, ExternalLink, AlertTriangle } from "lucide-react";
import { usePost, useUser } from "../api/hooks/useJsonPlaceholder";
import { PostComments } from "./PostComments";
import type { Post } from "../types/post";

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const id = Number(postId);

  const localPosts = JSON.parse(
    sessionStorage.getItem("localPosts") || "[]"
  ) as Post[];
  const local = localPosts.find((p) => p.id === id);

  const {
    data: remotePost,
    isLoading: loadingRemote,
    isError: remoteError,
    error: remoteErrorObj,
  } = usePost(id, {
    enabled: !local,
  });

  const post: Post | undefined = remotePost ?? local;
  const loadingPost = !post && loadingRemote;
  const postError = !post && remoteError;

  const userId = post?.userId ?? 0;
  const {
    data: author,
    isLoading: loadingUser,
    isError: userError,
  } = useUser(userId, {
    enabled: !!post,
  });

  if (loadingPost) {
    return (
      <div
        data-testid="post-loading"
        className="max-w-4xl mx-auto p-6 animate-pulse"
      >
        <div className="h-10 bg-slate-700 rounded w-3/4 mb-6" />
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 bg-slate-700 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-700 rounded w-1/3" />
            <div className="h-3 bg-slate-700 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-5/6" />
          <div className="h-4 bg-slate-700 rounded w-4/6" />
          <div className="h-4 bg-slate-700 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-10">
        <AlertTriangle className="h-16 w-16 text-red-400 dark:text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Error Loading Post
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {remoteErrorObj?.message || "Post not found."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2 -ml-1" />
          Back to All Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1.5" />
          Back to all posts
        </Link>
      </div>

      <article className="bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post?.title}
          </h1>

          <div className="mb-8 pt-4 border-t border-slate-200 dark:border-slate-700">
            {loadingUser ? (
              <p className="text-gray-600 mb-4">Loading author…</p>
            ) : userError || !author ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Unknown author (ID: {userId})
              </p>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-semibold text-xl">
                  {author.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {author.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    @{author.username}
                  </p>
                  <a
                    href={`mailto:${author.email}`}
                    className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    <Mail size={16} className="mr-1.5" />
                    {author.email}
                  </a>
                </div>
              </div>
            )}

            {author?.website && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                Website:{" "}
                <a
                  href={`https://${author.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  {author.website}
                  <ExternalLink size={14} className="ml-1.5" />
                </a>
              </p>
            )}
          </div>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mt-6 text-slate-700 dark:text-slate-300">
            {post?.body.split("\n").map((para, idx) => (
              <p key={idx} className="mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>

      <PostComments postId={id} />
    </div>
  );
};
