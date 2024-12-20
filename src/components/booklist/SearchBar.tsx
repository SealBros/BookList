import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  return (
    <div className="flex items-center space-x-4 flex-grow">
      <input
        type="text"
        className="w-full bg-white text-gray-700 py-2 px-4 rounded-md focus:outline-none h-[45px] border border-gray-300"
        placeholder="제목 또는 저자를 검색해 주세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
