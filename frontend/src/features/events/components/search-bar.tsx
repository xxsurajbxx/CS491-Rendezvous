import { useState } from "react";
import { Search } from "lucide-react"; // You can also use Heroicons

interface SearchBarProps {
  handleSearch(query: string): void,
}

const SearchBar = ({ handleSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    handleSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center rounded-md overflow-hidden shadow border h-12 w-full max-w-md mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 w-full outline-none"
      />
      <button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white px-4 h-full flex items-center justify-center">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}

export default SearchBar;