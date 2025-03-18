import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  style: "normal",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--rubik",
  subsets: ["latin"],
});
const inter = Inter({
  style: "normal",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--inter",
  subsets: ["latin"],
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
      <body className={"antialiased h-full bg-[#F0F4F8]"}>{children}</body>
    </html>
  );
}
