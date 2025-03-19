import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

export const rubik = Rubik({
  style: "normal",
  weight: ["400", "500", "600", "700"],
  variable: "--rubik",
});
export const inter = Inter({
  style: "normal",
  weight: ["400", "500", "600", "700"],
  variable: "--inter",
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
      <body className={"antialiased h-full"}>{children}</body>
    </html>
  );
}
