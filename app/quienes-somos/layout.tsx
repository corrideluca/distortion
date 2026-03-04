import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "En Distortion diseñamos prendas exclusivas con referencias a la cultura musical que marcó a generaciones enteras. Streetwear con identidad propia.",
  alternates: {
    canonical: "/quienes-somos",
  },
  openGraph: {
    title: "Quiénes Somos | Distortion",
    description:
      "En Distortion diseñamos prendas exclusivas con referencias a la cultura musical que marcó a generaciones enteras.",
    url: "https://distortionbrand.com/quienes-somos",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
