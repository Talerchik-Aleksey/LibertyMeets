import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "../Components/General/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import Header from "../Components/General/Header";
import Butler from '@next/font/local';
import  Nunito  from '@next/font/local';
import  Inter  from '@next/font/local';

const nunito = Nunito({
  src: [
    {
      path: "../public/fonts/Nunito-SemiBold600.ttf",
      weight: "600",
    },
  ],
  fallback: ["Nunito"],
});

const inter = Inter({  
  src: [
    {
      path: "../public/fonts/Inter-Bold700.woff2",
      weight: "700",
    },
  {
    path: "../public/fonts/Inter-ExtraBold.woff2",
    weight: "800",
  },
  {
    path: "../public/fonts/Inter-Medium500.woff2",
    weight: "500",
  },
  {
    path: "../public/fonts/Inter-Regular400.woff2",
    weight: "400",
  },
  {
    path: "../public/fonts/Inter-SemiBold600.woff2",
    weight: "700",
  }
],
fallback: ["Inter"] })

const butler = Butler({
  src: [
    {
      path: "../public/fonts/Butler-Bold700.woff2",
      weight: "700",
    },

    {
      path: "../public/fonts/Butler-Medium600.woff2",
      weight: "600",
    },
  ],
  fallback: ["Butler"],
  variable: "--font-butler"
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider>
      <style jsx global>{`
        :root {
          --font-butler: ${butler.style.fontFamily};
          --font-inter:${inter.style.fontFamily};
          --font-nunito:${nunito.style.fontFamily};
        }
      `}</style>

        <Header />
        <div className="main">
          <Component {...pageProps} />
        </div>
        <Footer />
      </SessionProvider>
    </>
  );
}
