import { useState } from "react";
import { Search, X } from "lucide-react"; // You can also use Heroicons

interface SearchBarProps {
  handleSearch(query: string): void,
}

const SearchBar = ({ handleSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleLiveSearch = (query: string) => {
    setQuery(query);
    handleSearch(query);
  }

  const handleClear = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <div className="flex items-center rounded-md overflow-hidden shadow border h-12 w-full max-w-md mb-4">
      <div className="bg-purple-900 text-white px-4 h-full flex items-center justify-center">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => handleLiveSearch(e.target.value)}
        className="pl-10 pr-10 py-2 w-full outline-none"
      />
      
      {/* Clear Button for search input field */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;