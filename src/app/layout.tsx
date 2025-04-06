import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Scientific Calculator",
  description: "A modern scientific calculator with theme support",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="calculator-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
