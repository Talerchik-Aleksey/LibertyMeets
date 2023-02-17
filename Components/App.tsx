import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "../Components/General/Footer/Footer";
import Header from "../Components/General/Header/Header";
import { useEffect } from "react";
import config from "config";
import { getLogger } from "../utils/logging";

export default function Appp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log(pageProps)
    const script = document.createElement("script");
    script.innerHTML = `(function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:${pageProps.hjid},hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return (
    <>
        <Header />
        <div className="main">
          <Component {...pageProps} />
        </div>
        <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const hjid = config.get<number>("hotjar.hjid");
  const logger = getLogger("db")
  logger.info("hello")
  return {
    props: { hjid },
  };
}
