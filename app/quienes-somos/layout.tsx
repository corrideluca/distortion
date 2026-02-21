import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conocé la historia de Sofía y SweetyBella. Pastelera apasionada desde temprana edad, comprometida con la calidad y el amor en cada creación artesanal.",
  alternates: {
    canonical: "/quienes-somos",
  },
  openGraph: {
    title: "Quiénes Somos | SweetyBella",
    description:
      "Conocé la historia de Sofía y SweetyBella. Pastelera apasionada desde temprana edad.",
    url: "https://sweetybella.com/quienes-somos",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
