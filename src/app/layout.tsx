import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Heroes Golf | Premium Charity Draw Platform",
  description: "Join the revolution. Play golf, support charities, win monthly prizes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body className={cn(
        "font-sans min-h-screen bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200",
        geistSans.variable,
        geistMono.variable
      )}>
        <Providers>
          <div className="relative flex min-h-screen flex-col isolate">
            <Navbar />
            <div className="pt-16 flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
