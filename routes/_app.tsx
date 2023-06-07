import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <html class="dark w-screen min-h-screen">
      <Head>
        <title>Vulniper</title>
        <meta name="description" content="Chatbot for cybersecurity. It helps our cybersecurity works such as penetration testing, threat hunting ans so on. It uses the open source Falcon LLM model in Hugging Face Hub." />
        <link rel="icon" type="image/x-icon" href="/logo.png" />
        <link rel="stylesheet" href="/styles.css" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hideckies" />
        <meta name="twitter:creator" content="@hideckies" />
        <meta property="og:url" content="https://vulniper.hdks.org/" />
        <meta property="og:title" content="Vulniper" />
        <meta property="og:description" content="Chatbot for cybersecurity. It helps our cybersecurity works such as penetration testing, threat hunting ans so on. It uses the open source Falcon LLM model in Hugging Face Hub." />
        <meta property="og:image" content="https://vulniper.hdks.org/screenshot.png" />
      </Head>
      <body class="w-full h-full bg-gray-200 dark:bg-gray-900 text-white">
        <div class="w-full h-full">
          <Component />
        </div>
      </body>
    </html>
  );
}