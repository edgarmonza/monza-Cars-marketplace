import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Monza Lab | Investment-Grade Automotive Assets",
  description:
    "The intelligent terminal for collector vehicle acquisition and analysis. AI-powered insights for smarter acquisitions.",
  keywords: [
    "car auction",
    "vehicle investment",
    "Bring a Trailer",
    "Cars and Bids",
    "collectible cars",
    "auction analysis",
    "classic cars",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark">
      <body
        className={`${publicSans.variable} font-sans antialiased bg-background text-foreground noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}
