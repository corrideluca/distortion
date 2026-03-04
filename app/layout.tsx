import type { Metadata } from "next";
import { Syne, Bebas_Neue } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://distortionbrand.com"),
  title: {
    default: "Distortion - Streetwear",
    template: "%s | Distortion",
  },
  description:
    "Distortion es una marca de streetwear independiente. Remeras, hoodies y accesorios con identidad propia. Drops limitados y pedidos personalizados.",
  keywords: [
    "streetwear",
    "remeras",
    "hoodies",
    "indumentaria",
    "Distortion",
    "ropa urbana",
    "drops",
    "Buenos Aires",
    "marca independiente",
    "custom",
  ],
  authors: [{ name: "Distortion", url: "https://distortionbrand.com" }],
  creator: "Distortion",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Distortion - Streetwear",
    description:
      "Remeras, hoodies y accesorios con identidad propia. Drops limitados y pedidos personalizados.",
    url: "https://distortionbrand.com",
    siteName: "Distortion",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "Distortion - Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distortion - Streetwear",
    description:
      "Remeras, hoodies y accesorios con identidad propia. Drops limitados.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
        className={`${syne.variable} ${bebas.variable} ${syne.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
