import { usePets } from "../context/PetContext";
import PetCard from "./PetCard";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";

function SkeletonCard() {
  return (
    <div
      className="kennel-card animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full aspect-[4/3] bg-pine/10" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-24 rounded bg-line/60" />
          <div className="h-4 w-14 rounded bg-line/40" />
        </div>
        <div className="h-4 w-40 rounded bg-line/50" />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-line/40" />
          <div className="h-3 w-4/5 rounded bg-line/40" />
        </div>
        <div className="h-9 w-full rounded bg-line/50 mt-2" />
      </div>
    </div>
  );
}

export default function PetList() {
  const { filteredPets, pets, loading, error, dataSource } = usePets();

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <SearchBar />
        <FilterBar />
      </div>

      {/* Data-source badge + count */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-sm text-ink/60">
          {loading ? (
            "Loading pets\u2026"
          ) : (
            <>
              Showing {filteredPets.length} of {pets.length} pets
            </>
          )}
        </p>

        {dataSource === "petfinder" && !loading && (
          <span className="font-stamp text-[10px] tracking-widest uppercase text-pine/70 border border-pine/30 px-2 py-0.5 rounded-sm">
            Live via Petfinder
          </span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="kennel-card p-4 mb-5 border-coral/40 bg-coral/5 text-sm text-coral"
        >
          <strong>Heads up:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredPets.length === 0 ? (
        <EmptyState
          title="No pets match those filters"
          message="Try a different search term or clear your filters to see every pet currently up for adoption."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </section>
  );
}
