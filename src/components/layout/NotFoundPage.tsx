import React from "react";
import { Link } from "react-router";
import { AlertTriangle, Home } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center  text-center px-4 py-10">
      <AlertTriangle className="h-20 w-20 text-amber-500 dark:text-amber-400 mb-6" />
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors"
      >
        <Home size={20} className="mr-2 -ml-1" />
        Go Back to Homepage
      </Link>
    </div>
  );
};
