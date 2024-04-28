import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strategem Zero",
  description: "The Open Source Strategem Hero Alternative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="strategen-zero.vercel.app">
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
