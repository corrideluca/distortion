import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedidos Personalizados",
  description:
    "Pedidos artesanales personalizados para cada ocasión. Tortas, bombones, alfajores y más — hechos especialmente para vos.",
  alternates: {
    canonical: "/pedidos",
  },
  openGraph: {
    title: "Pedidos Personalizados | SweetyBella",
    description:
      "Pedidos artesanales personalizados para cada ocasión especial.",
    url: "https://sweetybella.com/pedidos",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
