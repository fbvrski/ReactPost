export const Header: React.FC = () => {
  return (
    <header className="mb-10 sm:mb-12 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
          Posts Explorer
        </span>
      </h1>
      <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        Discover interesting articles and insights from our community.
      </p>
    </header>
  );
};
