import { useState } from "react";
import { usePosts } from "../api/hooks/useJsonPlaceholder";
import { PostItem } from "../components/posts/PostItem";
import { SearchBar } from "../components/ui/SearchBar";
import { Button } from "../components/ui/Button";
import { AddPostModal } from "../components/posts/AddPostModal";
import type { Post } from "../types/post";
import { PostCardPlaceholder } from "../components/posts/PostCardPlaceholder";
import { AlertTriangle } from "lucide-react";
import { useLocalPosts } from "../api/hooks/useLocalPosts";
import { toast } from "react-hot-toast";

const gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

const LoadingGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardPlaceholder key={i} />
      ))}
    </div>
  </div>
);

const ErrorPanel: React.FC<{ error: Error | null; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <div
    role="alert"
    aria-live="assertive"
    className="text-center py-10 p-6 rounded-lg"
  >
    <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-600 " />
    <p className="text-xl text-white ">Failed to load posts.</p>
    <p className="text-sm text-white  mt-2 mb-2">
      {error?.message || String(error)}
    </p>
    <Button onClick={onRetry}>Try Again</Button>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-16">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7l-4-4H7L3 7z"
      />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-200">
      No posts available
    </h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      There are currently no posts to display.
    </p>
  </div>
);

export const PostList: React.FC = () => {
  const {
    data: remotePosts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePosts();
  const { localPosts, addLocalPost } = useLocalPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const allPosts = [
    ...localPosts,
    ...remotePosts.filter((rp) => !localPosts.some((lp) => lp.id === rp.id)),
  ];

  const filtered = allPosts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (title: string, userId: number, body: string) => {
    const combinedPosts = [...localPosts, ...remotePosts];

    const maxId = combinedPosts.reduce(
      (max, post) => Math.max(max, post.id),
      0
    );
    const newPost: Post = { id: maxId + 1, userId, title, body };

    addLocalPost(newPost);
    setModalOpen(false);
    toast.success("Post added successfully");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Posts Explorer
        </h1>
        <Button onClick={() => setModalOpen(true)}>Add Post</Button>
      </div>

      <div className="w-full md:max-w-md mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          placeholder="Search posts..."
        />
      </div>

      <AddPostModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />

      {isLoading ? (
        <LoadingGrid />
      ) : isError ? (
        <ErrorPanel error={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={gridClasses}>
          {filtered.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
