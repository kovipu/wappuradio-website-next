import Document, { Html, Head, Main, NextScript } from 'next/document';

// A custom Document for Next.js to inject Tailwind styles to the body.
class MyDocument extends Document {
  render() {
    return (
      <Html lang="fi">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
            rel="stylesheet"
          />

          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/logo@32.png" sizes="32x32" type="image.png" />
          <link
            rel="icon"
            href="/logo@152.png"
            sizes="152x152"
            type="image.png"
          />
          <link
            rel="icon"
            href="/logo@192.png"
            sizes="192x192"
            type="image.png"
          />
          <link
            rel="icon"
            href="/logo@310.png"
            sizes="310x310"
            type="image.png"
          />
          <link
            rel="icon"
            href="/logo@512.png"
            sizes="512x512"
            type="image.png"
          />

          <meta name="theme-color" content="#001326" />

          <meta property="og:title" content="Turun Wappuradio" />
          <meta property="og:site_name" content="Turun Wappuradio" />
          <meta property="og:description" content="Lähetys 25.–27.10." />
          <meta property="og:image" content="/logo@192.png" />
          <meta property="og:url" content="https://www.turunwappuradio.com" />

          {/* Social media stuff */}
          <meta name="twitter:title" content="Turun Wappuradio" />
          <meta name="twitter:description" content="Lähetys 25.–27.10." />
          <meta name="twitter:image" content="/logo@192.png" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* Allow adding to homescreen */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {/* Minimal icons */}
          <link rel="icon" type="image/png" href="/logo@32.png" />
          <link rel="icon" sizes="192x192" href="/logo@192.png" />
          <link rel="apple-touch-icon" href="/logo@152.png" />
          <meta
            name="msapplication-square310x310logo"
            content="/logo@310.png"
          />

          {/* Apple */}
          <link rel="apple-touch-icon" href="/logo@32.png" />
          <link rel="apple-touch-icon" sizes="192x192" href="/logo@192.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/logo@512.png" />
        </Head>
        <body className="bg-purple-darkest bg-gradient-to-b from-purple-darkest to-purple-light">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
