import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitKaro: Split bills over UPI. Friends never install anything.",
  description: "SplitKaro lets one person collect money from friends after a group expense. Friends tap a link, their UPI app opens with the exact amount prefilled, done.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "SplitKaro: Split bills over UPI. Friends never install anything.",
    description: "SplitKaro lets one person collect money from friends after a group expense. Friends tap a link, their UPI app opens with the exact amount prefilled, done.",
    siteName: "SplitKaro",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
