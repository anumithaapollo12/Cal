import "./globals.css";
import { Inter } from "next/font/google";
import YearProgressBar from "./components/YearProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Calendar App",
  description: "A modern calendar application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="flex flex-col min-h-full">
          <main className="flex-1 bg-gray-50/50">{children}</main>
          <div className="h-12"> {/* Spacer for progress bar */}</div>
          <YearProgressBar />
        </div>
      </body>
    </html>
  );
}
