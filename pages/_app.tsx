import "../styles/globals.css";
import type { AppProps } from "next/app";
import GuestHeader from "../Components/General/GuestHeader";
import Footer from "../Components/General/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GuestHeader />
      <Component {...pageProps} />
      <Footer/>
    </>
  );
}
