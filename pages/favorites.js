import Head from "next/head";
import { usePets } from "../context/PetContext";
import PetCard from "../components/PetCard";
import EmptyState from "../components/EmptyState";

export default function Favorites() {
  const { favoritePets } = usePets();

  return (
    <>
      <Head>
        <title>Favorites — PawPal</title>
      </Head>

      <h1 className="text-3xl mb-1">Your favorites</h1>
      <p className="text-ink/60 mb-6">
        Pets you&apos;ve saved to come back to later.
      </p>

      {favoritePets.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Tap the heart on any pet's card to save them here for easy comparison."
          actionHref="/"
          actionLabel="Browse adoptable pets"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoritePets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </>
  );
}
