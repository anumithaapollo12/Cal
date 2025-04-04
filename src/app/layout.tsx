import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kanban Calendar",
  description:
    "A premium calendar experience with Kanban-style event management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-sans h-full bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]`}
      >
        <div className="min-h-full relative backdrop-blur-[2px]">
          {children}
        </div>
      </body>
    </html>
  );
}
