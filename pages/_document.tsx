import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
      <link rel="preload" href="../public/fonts/Nunito-SemiBold600.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Inter-Bold700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Inter-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Inter-Medium500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Inter-Regular400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Inter-SemiBold600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Butler-Bold700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="../public/fonts/Butler-Medium600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
