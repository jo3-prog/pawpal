import { usePets } from "../context/PetContext";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = usePets();

  return (
    <div className="relative flex-1">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by name, type, or breed..."
        aria-label="Search pets by name, type, or breed"
        className="input-field pl-10"
      />
    </div>
  );
}
