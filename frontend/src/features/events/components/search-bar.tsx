import { useState } from "react";
import { Search } from "lucide-react"; // You can also use Heroicons

interface SearchBarProps {
  handleSearch(query: string): void,
}

const SearchBar = ({ handleSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleLiveSearch = (query: string) => {
    // if (!query.trim()) return;
    setQuery(query);
    handleSearch(query);
  };

  return (
    <form className="flex items-center rounded-md overflow-hidden shadow border h-12 w-full max-w-md mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => handleLiveSearch(e.target.value)}
        className="px-4 py-2 w-full outline-none"
      />
      <button type="submit" className="bg-purple-900 hover:bg-gray-700 text-white px-4 h-full flex items-center justify-center">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}

export default SearchBar;