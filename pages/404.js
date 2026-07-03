import Head from "next/head";
import EmptyState from "../components/EmptyState";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page not found — PawPal</title>
      </Head>
      <EmptyState
        title="This kennel card is empty"
        message="We couldn't find the page you were looking for. It may have been adopted already."
        actionHref="/"
        actionLabel="Back to all pets"
      />
    </>
  );
}
