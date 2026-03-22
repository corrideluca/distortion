"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

interface Artist {
  id: string;
  name: string;
  slug?: string | null;
}

export default function Navbar({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const { totalItems, setCartOpen } = useCart();

  // When transparent and not scrolled, use white text
  const isLight = transparent && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/artists")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setArtists(data))
      .catch(() => {});
  }, []);

  const handleContactClick = () => {
    window.open(
      `https://wa.me/5491160286919?text=${encodeURIComponent(
        "Hola! Me gustaría obtener más información.",
      )}`,
      "_blank",
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? "pointer-events-none" : ""
        } ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : transparent
              ? "bg-transparent"
              : "bg-white"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex-shrink-0 hover:opacity-75 transition-opacity z-100 relative"
            >
              <Image
                src="/logo.png"
                width={180}
                height={80}
                alt="Distortion"
                className="object-contain h-32 mt-2 sm:mt-0 md:h-32 w-auto transition-all"
                style={
                  isLight ? { filter: "brightness(0) invert(1)" } : undefined
                }
              />
            </Link>

            {/* Center: Artist links (desktop) */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={
                    artist.slug
                      ? `/artistas/${artist.slug}`
                      : `/?artist=${artist.id}`
                  }
                  className={`transition-colors font-medium text-sm tracking-wide uppercase ${isLight ? "text-white hover:text-white/70" : "text-[#000000] hover:text-[#666666]"}`}
                >
                  {artist.name}
                </Link>
              ))}
            </div>

            {/* Right: Cart + Hamburger (mobile) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors cursor-pointer ${mobileMenuOpen ? "md:block hidden" : ""} ${isLight ? "text-white hover:text-white/70" : "text-black hover:text-black/60"}`}
                aria-label="Abrir carrito"
              >
                CART ({totalItems})
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`md:hidden p-1 transition-colors ${mobileMenuOpen ? "hidden" : ""} ${isLight ? "text-white" : "text-[#000000]"}`}
                aria-label="Abrir menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu — fullscreen overlay (outside nav to avoid z-index issues) ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-black/80 flex flex-col">
          {/* Top bar: logo + cart + close */}
          <div className="flex items-center justify-between px-4 -mt-7">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:opacity-75 transition-opacity"
            >
              <Image
                src="/logo.png"
                width={140}
                height={70}
                alt="Distortion"
                className="object-contain h-32 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => setCartOpen(true), 100);
                }}
                className="text-white text-sm font-medium tracking-wide uppercase cursor-pointer"
              >
                CART ({totalItems})
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-1 cursor-pointer"
                aria-label="Cerrar menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col px-6 mt-12">
            <nav className="space-y-5">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={
                    artist.slug
                      ? `/artistas/${artist.slug}`
                      : `/?artist=${artist.id}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-lg font-medium uppercase tracking-widest hover:text-white/60 transition-colors"
                >
                  {artist.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
