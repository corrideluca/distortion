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
  title: "SeweetyBella - Productos Artesanales",
  description: "Descubrí nuestros productos artesanales hechos con amor y los mejores ingredientes. Panadería y repostería de calidad.",
  keywords: ["panadería", "bakery", "productos artesanales", "repostería", "SeweetyBella"],
  authors: [{ name: "SeweetyBella" }],
  openGraph: {
    title: "SeweetyBella - Productos Artesanales",
    description: "Productos artesanales hechos con amor y los mejores ingredientes",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
