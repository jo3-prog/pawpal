import Head from "next/head";
import { usePets } from "../context/PetContext";
import PetList from "../components/PetList";

export default function Home() {
  const { pets } = usePets();

  return (
    <>
      <Head>
        <title>PawPal — Find your new best friend</title>
      </Head>

      <section className="kennel-card flex-col md:flex-row md:flex items-center gap-6 p-6 sm:p-8 mb-10">
        <div className="flex-1">
          <span className="ink-stamp ink-stamp--available">
            {pets.length} on intake today
          </span>
          <h1 className="text-3xl sm:text-4xl mt-4 leading-tight">
            Every good home starts
            <br className="hidden sm:block" /> with a kennel card.
          </h1>
          <p className="text-ink/70 mt-3 max-w-md">
            Browse pets currently up for adoption, save your favorites, and
            send an application straight to the shelter — all from one
            place.
          </p>
        </div>
        <div
          className="hidden md:flex w-40 h-40 rounded-full bg-marigold/20 items-center justify-center text-6xl shrink-0"
          aria-hidden="true"
        >
          🐾
        </div>
      </section>

      <PetList />
    </>
  );
}
