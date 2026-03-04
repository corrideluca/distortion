"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Artist {
  id: string;
  name: string;
  slug?: string | null;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

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

  const openArtists = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setArtistsOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setArtistsOpen(false), 120);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
    setMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    window.open(
      `https://wa.me/5491160286919?text=${encodeURIComponent("Hola! Me gustaría obtener más información.")}`,
      "_blank"
    );
  };

  const artistHref = (a: Artist) =>
    a.slug ? `/artistas/${a.slug}` : `/?artist=${a.id}`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-black/10 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20 gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:opacity-75 transition-opacity">
            <Image
              src="/logo.png"
              width={100}
              height={50}
              alt="Distortion"
              className="object-contain h-24 w-auto"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">

            {/* Artistas trigger */}
            <button
              onMouseEnter={openArtists}
              onMouseLeave={scheduleClose}
              className="flex items-center gap-1.5 text-[#000000] hover:text-[#444444] transition-colors font-medium text-base cursor-pointer select-none"
            >
              Artistas
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ${artistsOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              onClick={handleContactClick}
              className="text-[#000000] hover:text-[#666666] transition-colors font-medium text-base cursor-pointer"
            >
              Contacto
            </button>

            <Link
              href="/quienes-somos"
              className="text-[#000000] hover:text-[#666666] transition-colors font-medium text-base"
            >
              Quiénes Somos
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center ml-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-44 lg:w-60 pl-4 pr-10 py-2 text-sm bg-[#f5f5f5] border border-black/10 rounded-full focus:outline-none focus:ring-1 focus:ring-black/30 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#000000] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#000000] p-2 ml-auto"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mega-menu panel ── */}
      <AnimatePresence>
        {artistsOpen && (
          <motion.div
            onMouseEnter={openArtists}
            onMouseLeave={scheduleClose}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="hidden md:block absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-black/[0.07] shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {artists.length === 0 ? (
                <p className="text-sm text-[#888]">Sin artistas aún.</p>
              ) : (
                <>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-5">
                    Artistas
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {artists.map((artist, i) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: i * 0.035 }}
                      >
                        <Link
                          href={artistHref(artist)}
                          onClick={() => setArtistsOpen(false)}
                          className="group flex items-center gap-2 text-[#111] hover:text-black transition-colors"
                        >
                          <span className="text-base font-semibold tracking-tight group-hover:translate-x-0.5 transition-transform duration-150">
                            {artist.name}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-black/40"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-black/10"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-4 pr-10 py-2 text-sm bg-[#f5f5f5] border border-black/10 rounded-full focus:outline-none focus:ring-1 focus:ring-black/30"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Artists list */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#666666] mb-2 mt-1">Artistas</p>
                {artists.length === 0 ? (
                  <p className="text-sm text-[#666666] py-1">Sin artistas aún</p>
                ) : (
                  artists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={artistHref(artist)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[#000000] hover:text-[#666666] transition-colors font-medium text-base py-1.5"
                    >
                      {artist.name}
                    </Link>
                  ))
                )}
              </div>

              <button
                onClick={() => { handleContactClick(); setMobileMenuOpen(false); }}
                className="block text-[#000000] hover:text-[#666666] transition-colors font-medium text-lg py-2 cursor-pointer"
              >
                Contacto
              </button>

              <Link
                href="/quienes-somos"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#000000] hover:text-[#666666] transition-colors font-medium text-lg py-2"
              >
                Quiénes Somos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
