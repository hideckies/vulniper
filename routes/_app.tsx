import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <html class="dark w-screen min-h-screen">
      <Head>
        <title>Vulniper</title>
        <meta name="description" content="Chatbot for cybersecurity." />
        <link rel="icon" type="image/x-icon" href="/logo.png" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <body class="w-full h-full bg-gray-200 dark:bg-gray-900 text-white">
        <div class="w-full h-full">
          <Component />
        </div>
      </body>
    </html>
  );
}