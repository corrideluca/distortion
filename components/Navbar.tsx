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

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
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
        "Hola! Me gustaría obtener más información."
      )}`,
      "_blank"
    );
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : transparent
            ? "bg-transparent"
            : "bg-white"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Hamburger (mobile) / Logo (desktop) */}
          <div className="flex items-center gap-6">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 -ml-2 transition-colors ${isLight ? "text-white" : "text-[#000000]"}`}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Logo */}
            <Link
              href="/"
              className="hidden md:block flex-shrink-0 hover:opacity-75 transition-opacity"
            >
              <Image
                src="/logo.png"
                width={180}
                height={80}
                alt="Distortion"
                className="object-contain h-32 w-auto transition-all"
                style={isLight ? { filter: "brightness(0) invert(1)" } : undefined}
              />
            </Link>
          </div>

          {/* Center: Artist links (desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={artist.slug ? `/artistas/${artist.slug}` : `/?artist=${artist.id}`}
                className={`transition-colors font-medium text-sm tracking-wide uppercase ${isLight ? "text-white hover:text-white/70" : "text-[#000000] hover:text-[#666666]"}`}
              >
                {artist.name}
              </Link>
            ))}
          </div>

          {/* Center: Logo (mobile) */}
          <Link
            href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2 hover:opacity-75 transition-opacity"
          >
            <Image
              src="/logo.png"
              width={100}
              height={50}
              alt="Distortion"
              className="object-contain h-14 w-auto transition-all"
              style={isLight ? { filter: "brightness(0) invert(1)" } : undefined}
            />
          </Link>

          {/* Right: Cart */}
          <div className="flex items-center">
            <button
              onClick={() => setCartOpen(true)}
              className={`text-sm font-medium tracking-wide uppercase transition-colors cursor-pointer ${isLight ? "text-white hover:text-white/70" : "text-black hover:text-black/60"}`}
              aria-label="Abrir carrito"
            >
              CART ({totalItems})
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-black/10"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Artist links */}
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={artist.slug ? `/artistas/${artist.slug}` : `/?artist=${artist.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#000000] hover:text-[#666666] transition-colors font-medium text-base py-2 uppercase tracking-wide"
                >
                  {artist.name}
                </Link>
              ))}

              <div className="border-t border-black/10 pt-2 mt-2">
                <button
                  onClick={() => {
                    handleContactClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-[#000000] hover:text-[#666666] transition-colors font-medium text-base py-2 cursor-pointer"
                >
                  Contacto
                </button>

                <Link
                  href="/quienes-somos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#000000] hover:text-[#666666] transition-colors font-medium text-base py-2"
                >
                  Quiénes Somos
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
