import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePets } from "../context/PetContext";
import AdoptionModal from "./AdoptionModal";

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

const DETAIL_FIELDS = [
  { key: "type", label: "Type" },
  { key: "breed", label: "Breed" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
];

export default function PetDetail({ pet }) {
  const { isFavorite, toggleFavorite, hasApplied } = usePets();
  const [modalOpen, setModalOpen] = useState(false);

  const favorited = isFavorite(pet.id);
  const applied = hasApplied(pet.id);

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-pine hover:text-pine-dark mb-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to all pets
      </Link>

      <div className="kennel-card md:flex-row md:flex overflow-hidden">
        <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto bg-pine/10">
          <Image
            src={pet.image}
            alt={`Photo of ${pet.name}, a ${pet.age} old ${pet.breed}`}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          <span
            className={`ink-stamp absolute top-4 left-4 bg-card/90 ${
              applied ? "ink-stamp--applied" : "ink-stamp--available"
            }`}
          >
            {applied ? "Applied" : "Available"}
          </span>
        </div>

        <div className="p-6 sm:p-8 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-semibold">{pet.name}</h1>
            <span className="tag-number mt-2 whitespace-nowrap">
              NO. {String(pet.id).padStart(4, "0")}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mt-5 border-t border-b border-line/60 py-5">
            {DETAIL_FIELDS.map((field) => (
              <div key={field.key}>
                <dt className="font-stamp text-xs uppercase tracking-widest text-ink/45">
                  {field.label}
                </dt>
                <dd className="font-medium mt-0.5">{pet[field.key]}</dd>
              </div>
            ))}
          </dl>

          <p className="text-ink/80 leading-relaxed mt-5">
            {pet.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={applied}
              className="btn-primary"
            >
              {applied ? "Application submitted" : "Apply to adopt"}
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(pet.id)}
              aria-pressed={favorited}
              className={`btn-secondary ${favorited ? "text-coral border-coral hover:bg-coral" : ""}`}
            >
              <HeartIcon filled={favorited} />
              {favorited ? "Saved to favorites" : "Add to favorites"}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <AdoptionModal pet={pet} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
