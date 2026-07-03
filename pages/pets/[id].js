import Head from "next/head";
import { useRouter } from "next/router";
import pets from "../../data/pets";
import PetDetail from "../../components/PetDetail";

export default function PetPage({ pet }) {
  const router = useRouter();

  if (router.isFallback) {
    return <p className="text-center text-ink/60 py-20">Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{pet.name} — PawPal</title>
        <meta
          name="description"
          content={`Meet ${pet.name}, a ${pet.age} old ${pet.breed} looking for a home.`}
        />
      </Head>
      <PetDetail pet={pet} />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: pets.map((pet) => ({ params: { id: String(pet.id) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const pet = pets.find((item) => String(item.id) === params.id);

  if (!pet) {
    return { notFound: true };
  }

  return { props: { pet } };
}
