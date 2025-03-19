import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

export const rubik = Rubik({
  style: "normal",
  weight: ["400", "500", "600", "700"],
  variable: "--rubik",
  subsets: ["latin"], // Choose a subset from the available list
  preload: false,
});
export const inter = Inter({
  style: "normal",
  weight: ["400", "500", "600", "700"],
  variable: "--inter",
  subsets: ["latin"],
  preload: false, // Disable preloading
});

export const metadata: Metadata = {
  title: "Future of furnishing",
  description: "home furnishing Ai based website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rubik.variable} `}>
      <body className={"antialiased h-full bg-background"}>{children}</body>
    </html>
  );
}
