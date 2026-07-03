import { usePets } from "../context/PetContext";

export default function FilterBar() {
  const { types, breeds, filters, setFilters, clearFilters, searchTerm } =
    usePets();

  const hasActiveFilters =
    filters.type !== "All" || filters.breed !== "All" || searchTerm.trim();

  function handleTypeChange(event) {
    // Changing type resets breed since the breed list depends on type.
    setFilters({ type: event.target.value, breed: "All" });
  }

  function handleBreedChange(event) {
    setFilters((current) => ({ ...current, breed: event.target.value }));
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="sr-only" htmlFor="filter-type">
        Filter by type
      </label>
      <select
        id="filter-type"
        value={filters.type}
        onChange={handleTypeChange}
        className="input-field w-auto min-w-[8.5rem]"
      >
        {types.map((type) => (
          <option key={type} value={type}>
            {type === "All" ? "All types" : type}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-breed">
        Filter by breed
      </label>
      <select
        id="filter-breed"
        value={filters.breed}
        onChange={handleBreedChange}
        className="input-field w-auto min-w-[10rem]"
      >
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed === "All" ? "All breeds" : breed}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-coral hover:text-coral-dark underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
