"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  checkoutProduct?: { id: string } | null;
  artistId?: string | null;
  artist?: { id: string; name: string } | null;
}

interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  image?: string | null;
  products: Product[];
}

function ProductGridCard({ product, index }: { product: Product; index: number }) {
  const checkoutUrl = product.checkoutProduct
    ? `/checkout/${product.checkoutProduct.id}`
    : "#";

  return (
    <Link href={checkoutUrl}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group cursor-pointer"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={80}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 className="text-white text-xs sm:text-sm font-normal leading-tight uppercase">
              {product.name}
            </h3>
            <p className="text-white/70 text-xs mt-0.5">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ArtistPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/artists/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data && data.products) setArtist(data);
        else if (data && !data.products) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black/20" />
      </div>
    );
  }

  if (notFound || !artist) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <p className="text-2xl font-bold text-[#000000] mb-2">Artista no encontrado</p>
          <p className="text-[#666666] mb-6">Este artista no existe o fue eliminado.</p>
          <Link href="/" className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-[#333] transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-16 sm:pt-20">
        {artist.products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-xl text-[#666666]">Sin productos aún.</p>
            <p className="text-[#666666]/70 mt-2">El próximo drop viene pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {artist.products.map((product, index) => (
              <ProductGridCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
