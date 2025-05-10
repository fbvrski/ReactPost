export const PostCardPlaceholder: React.FC = () => (
  <div
    data-testid="postcard-placeholder-item"
    aria-hidden="true"
    className="
      flex flex-col
      bg-white dark:bg-slate-800
      shadow-lg rounded-xl overflow-hidden
      animate-pulse
    "
  >
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3" />

      <div className="space-y-2 flex-grow mb-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/5" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/5" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
