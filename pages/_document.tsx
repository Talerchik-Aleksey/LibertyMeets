import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Connect with like-minded individuals who share your values of freedom and liberty. LibertyMeets is the perfect platform for finding new friends in your town."
        />
        <meta
          property="og:title"
          content="LibertyMeets - Find Freedom-Friendly Folks Near You"
        />
        <meta
          property="og:description"
          content="Connect with like-minded individuals who share your values of freedom and liberty. LibertyMeets is the perfect platform for finding new friends in your town."
        />
        <meta
          name="twitter:title"
          content="LibertyMeets - Find Freedom-Friendly Folks Near You"
        />
        <meta
          name="twitter:description"
          content="Connect with like-minded individuals who share your values of freedom and liberty. LibertyMeets is the perfect platform for finding new friends in your town."
        />
        <meta property="og:image" content="/favicon.png" />
        <meta property="twitter:image" content="/favicon.png" />
        <link rel="icon" type="image/svg" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
