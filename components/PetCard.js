import Image from "next/image";
import Link from "next/link";
import { usePets } from "../context/PetContext";

function HeartIcon({ filled }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 4.2c2.1-.5 4.1.5 5.2 2.2.4.6 1.4.6 1.8 0 1.1-1.7 3.1-2.7 5.2-2.2C21.2 5 22.6 8.6 21 12 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export default function PetCard({ pet }) {
  const { isFavorite, toggleFavorite, hasApplied } = usePets();
  const favorited = isFavorite(pet.id);
  const applied = hasApplied(pet.id);

  return (
    <article className="kennel-card group">
      <div className="relative">
        <Link href={`/pets/${pet.id}`} className="block">
          <div className="relative w-full aspect-[4/3] bg-pine/10">
            <Image
              src={pet.image}
              alt={`Photo of ${pet.name}, a ${pet.age} old ${pet.breed}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </Link>

        <span
          className={`ink-stamp absolute top-3 left-3 bg-card/90 ${
            applied ? "ink-stamp--applied" : "ink-stamp--available"
          }`}
        >
          {applied ? "Applied" : "Available"}
        </span>

        <button
          type="button"
          onClick={() => toggleFavorite(pet.id)}
          aria-pressed={favorited}
          aria-label={
            favorited
              ? `Remove ${pet.name} from favorites`
              : `Add ${pet.name} to favorites`
          }
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-card/90 shadow-card transition-colors ${
            favorited ? "text-coral" : "text-ink/50 hover:text-coral"
          }`}
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight">{pet.name}</h3>
          <span className="tag-number whitespace-nowrap mt-1">
            NO. {String(pet.id).padStart(4, "0")}
          </span>
        </div>

        <p className="text-sm text-ink/70 mt-1">
          {pet.breed}
          <span className="paw-divider" />
          {pet.age}
          <span className="paw-divider" />
          {pet.gender}
        </p>

        <p className="text-sm text-ink/80 mt-3 line-clamp-2 flex-1">
          {pet.description}
        </p>

        <Link
          href={`/pets/${pet.id}`}
          className="mt-4 btn-secondary text-sm py-2"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
