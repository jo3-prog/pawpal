import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { usePets } from "../context/PetContext";
import EmptyState from "../components/EmptyState";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Applications() {
  const { applications, getPetById, withdrawApplication } = usePets();

  return (
    <>
      <Head>
        <title>My Applications — PawPal</title>
      </Head>

      <h1 className="text-3xl mb-1">My applications</h1>
      <p className="text-ink/60 mb-6">
        Adoption applications you&apos;ve submitted to the shelter.
      </p>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          message="When you apply to adopt a pet, your submission will show up here so you can track it."
          actionHref="/"
          actionLabel="Browse adoptable pets"
        />
      ) : (
        <ul className="space-y-4">
          {applications
            .slice()
            .reverse()
            .map((application) => {
              const pet = getPetById(application.petId);
              if (!pet) return null;

              return (
                <li
                  key={application.id}
                  className="kennel-card flex-row flex items-center gap-4 p-4"
                >
                  <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-pine/10">
                    <Image
                      src={pet.image}
                      alt={`Photo of ${pet.name}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Link
                        href={`/pets/${pet.id}`}
                        className="font-semibold hover:text-pine"
                      >
                        {pet.name}
                      </Link>
                      <span className="ink-stamp ink-stamp--applied text-[10px]">
                        Submitted
                      </span>
                    </div>
                    <p className="text-sm text-ink/60 truncate">
                      Applicant: {application.name} &middot;{" "}
                      {application.email}
                    </p>
                    <p className="font-stamp text-xs text-ink/40 mt-1">
                      Submitted {formatDate(application.submittedAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => withdrawApplication(application.id)}
                    className="text-sm font-medium text-coral hover:text-coral-dark underline underline-offset-2 shrink-0"
                  >
                    Withdraw
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
}
