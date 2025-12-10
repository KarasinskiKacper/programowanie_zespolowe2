import type { AppProps } from "next/app";
import { RoomsProvider } from "../components/context/RoomContext";
import "../app/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoomsProvider>
      <Component {...pageProps} />
    </RoomsProvider>
  );
}
