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
  metadataBase: new URL("https://sweetybella.com"),
  title: {
    default: "SweetyBella - Pastelería Artesanal",
    template: "%s | SweetyBella",
  },
  description:
    "Descubrí nuestros productos artesanales hechos con amor: tortas, alfajores, brownies y más. Pedidos personalizados para cada ocasión en Gral. Pacheco, Buenos Aires.",
  keywords: [
    "pastelería artesanal",
    "repostería",
    "tortas personalizadas",
    "alfajores",
    "brownies",
    "SweetyBella",
    "Gral. Pacheco",
    "Buenos Aires",
    "pedidos a domicilio",
    "pastelería casera",
  ],
  authors: [{ name: "Sofía", url: "https://sweetybella.com" }],
  creator: "SweetyBella",
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
    title: "SweetyBella - Pastelería Artesanal",
    description:
      "Productos artesanales hechos con amor y los mejores ingredientes. Tortas, alfajores y brownies para cada ocasión.",
    url: "https://sweetybella.com",
    siteName: "SweetyBella",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "SweetyBella - Pastelería Artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SweetyBella - Pastelería Artesanal",
    description:
      "Productos artesanales hechos con amor y los mejores ingredientes.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
