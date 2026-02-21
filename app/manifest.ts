import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SweetyBella - Pastelería Artesanal",
    short_name: "SweetyBella",
    description:
      "Productos artesanales hechos con amor y los mejores ingredientes",
    start_url: "/",
    display: "standalone",
    background_color: "#301014",
    theme_color: "#301014",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
