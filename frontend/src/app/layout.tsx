import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { RoomsProvider } from "../components/context/RoomContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Komunikator",
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={inter.variable}>
      <body>
        <RoomsProvider>{children}</RoomsProvider>
      </body>
    </html>
  );
}