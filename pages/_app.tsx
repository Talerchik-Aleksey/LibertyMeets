import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../Components/General/Header";
import Footer from "../Components/General/Footer";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  );
}
