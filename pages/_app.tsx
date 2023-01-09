import "../styles/globals.css";
import type { AppProps } from "next/app";
import GuestHeader from "../Components/General/GuestHeader";
import Footer from "../Components/General/Footer";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider>
        <GuestHeader />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  );
}
