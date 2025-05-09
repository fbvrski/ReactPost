import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  placeholder = "Search posts...",
}) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder={placeholder}
      aria-label="Search posts"
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black bg-white"
    />
  </div>
);
