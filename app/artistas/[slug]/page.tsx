"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
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

export default function ArtistPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselCanLeft, setCarouselCanLeft] = useState(false);
  const [carouselCanRight, setCarouselCanRight] = useState(true);

  const updateCarouselArrows = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCarouselCanLeft(el.scrollLeft > 0);
    setCarouselCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scrollCarousel = useCallback((dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const firstItem = el.firstElementChild as HTMLElement;
    const amount = firstItem ? firstItem.offsetWidth : el.clientWidth / 4;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetch(`/api/artists/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setArtist(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(updateCarouselArrows, 50);
    return () => clearTimeout(timer);
  }, [artist, updateCarouselArrows]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <Navbar />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black/20" />
      </div>
    );
  }

  if (notFound || !artist) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <p className="text-2xl font-bold text-[#000000] mb-2">Artista no encontrado</p>
          <p className="text-[#666666] mb-6">Este artista no existe o fue eliminado.</p>
          <Link href="/" className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-[#333] transition-colors">
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px]">
        {/* Background image — uses Next.js Image so Drive URLs are proxied correctly */}
        <div className="absolute inset-0">
          <Image
            src={artist.image || "/hero.jpg"}
            alt={artist.name}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        <div className="relative h-full flex flex-col items-center justify-end pb-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-white/50 mb-4">
              Artista
            </p>
            <h1 className="text-[5rem] sm:text-[7rem] lg:text-[10rem] text-white leading-none tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              {artist.name}
            </h1>
            {artist.bio && (
              <p className="mt-4 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
                {artist.bio}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[#000000] mb-3 tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              Colección
            </h2>
            <p className="text-base text-[#666666]">
              Drops de{" "}
              <span className="font-semibold text-black">{artist.name}</span>
            </p>
          </motion.div>

          {artist.products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-[#666666]">Sin productos aún.</p>
              <p className="text-[#666666]/70 mt-2">
                El próximo drop viene pronto.
              </p>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Left arrow */}
              <button
                onClick={() => scrollCarousel("left")}
                disabled={!carouselCanLeft}
                aria-label="Anterior"
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none transition-opacity cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Carousel */}
              <div
                ref={carouselRef}
                onScroll={updateCarouselArrows}
                className="flex overflow-x-auto hide-scrollbar"
              >
                {artist.products.map((product, index) => (
                  <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3">
                    <ProductCard
                      {...product}
                      index={index}
                      adminMode={false}
                      onDeleted={() => {}}
                      onEdit={() => {}}
                    />
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => scrollCarousel("right")}
                disabled={!carouselCanRight}
                aria-label="Siguiente"
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none transition-opacity cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
