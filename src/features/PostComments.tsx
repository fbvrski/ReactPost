import { useComments } from "../api/hooks/useJsonPlaceholder";
import type { Comment } from "../types/comment";

export const CommentPlaceholder: React.FC = () => (
  <div className="p-4 border-b border-slate-700 animate-pulse">
    <div className="h-4 bg-slate-600 rounded w-1/3 mb-2" />
    <div className="h-3 bg-slate-600 rounded w-1/4 mb-4" />
    <div className="space-y-1">
      <div className="h-3 bg-slate-600 rounded w-full" />
      <div className="h-3 bg-slate-600 rounded w-5/6" />
      <div className="h-3 bg-slate-600 rounded w-4/6" />
    </div>
  </div>
);

export const PostComments: React.FC<{ postId: number }> = ({ postId }) => {
  const {
    data: comments,
    isLoading: loadingComments,
    isError: isErrorComments,
  } = useComments(postId);

  if (loadingComments) {
    return (
      <section className="mt-12 space-y-4">
        {[...Array(4)].map((_, i) => (
          <CommentPlaceholder key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Comments</h2>
      {comments && comments.length > 0 ? (
        comments.map((c: Comment) => (
          <div key={c.id} className="border-b border-slate-700 py-4">
            <p className="font-medium text-slate-200">{c.name}</p>
            <p className="text-sm text-blue-400 mb-2">{c.email}</p>
            <p className="text-slate-300">{c.body}</p>
          </div>
        ))
      ) : isErrorComments ? (
        <p className="text-slate-400">Failed to load comments.</p>
      ) : (
        <p className="text-slate-400">No comments found.</p>
      )}
    </section>
  );
};
