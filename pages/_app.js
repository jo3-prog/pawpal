import Layout from "../components/Layout";
import { PetProvider } from "../context/PetContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <PetProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PetProvider>
  );
}
