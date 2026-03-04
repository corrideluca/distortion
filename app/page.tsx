"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import AdminOverlay, {
  AddProductCard,
  AddProductModal,
} from "@/components/AdminOverlay";
import { getSetting, updateSetting } from "@/app/actions";
import Footer from "@/components/Footer";

const DEFAULT_HERO_IMAGE = "/hero.jpg";

function extractDriveId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : url.trim();
}

function toDriveDirectUrl(url: string): string {
  return `https://drive.google.com/uc?export=view&id=${extractDriveId(url)}`;
}

function toDriveVideoUrl(url: string): string {
  return `https://lh3.googleusercontent.com/d/${extractDriveId(url)}`;
}

function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov");
}

const testimonials = [
  {
    quote: "La calidad de las remeras es increíble, se nota la diferencia.",
    name: "Virginia Sangiuliano",
  },
  {
    quote:
      "El hoodie llegó perfecto, el diseño es una locura. Recomiendo 100%.",
    name: "Corrado De Luca",
  },
  {
    quote: "Pedí una remera custom y quedó exactamente como la imaginé.",
    name: "Daniela Imbrogno",
  },
  {
    quote: "Los drops se agotan rápido, atentos a las novedades.",
    name: "Chiara Adamo Sangiuliano",
  },
  {
    quote: "La tela y el acabado son de primera. Vale cada peso.",
    name: "Agustin Casero",
  },
];

function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <section
      className="relative py-16 sm:py-24 px-4 overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url('${DEFAULT_HERO_IMAGE}')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#000000]/55" />
      <div className="max-w-lg mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase text-white/70 mb-10 text-center"
        >
          Lo que dice la comunidad
        </motion.p>

        <div className="relative h-56 sm:h-48">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ willChange: "transform, opacity" }}
              className="absolute inset-0"
            >
              {/* Chat bubble */}
              <div className="relative bg-white rounded-2xl rounded-bl-none shadow-md px-6 py-5 mb-4">
                <p className="text-lg sm:text-xl font-semibold text-[#000000] leading-snug">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>
                {/* Tail */}
                <div
                  className="absolute left-0 -bottom-4"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "16px solid white",
                    borderRight: "16px solid transparent",
                  }}
                />
              </div>
              {/* Avatar + name */}
              <div className="flex items-center gap-3 pl-1 pt-3">
                <div className="w-8 h-8 rounded-full bg-[#ffffff]/15 border border-[#ffffff]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#ffffff] text-xs font-bold">
                    {initials(testimonials[current].name)}
                  </span>
                </div>
                <span className="text-sm font-medium text-white/70">
                  {testimonials[current].name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === current
                  ? "w-6 h-2 bg-[#ffffff]"
                  : "w-2 h-2 bg-[#ffffff]/25 hover:bg-[#ffffff]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  artistId?: string | null;
  artist?: { id: string; name: string } | null;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQ = searchParams.get("q") || "";
  const searchArtist = searchParams.get("artist") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Carousel
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
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  // Hero settings
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [showHeroEdit, setShowHeroEdit] = useState(false);
  const [heroImageInput, setHeroImageInput] = useState("");
  const [heroIsDrive, setHeroIsDrive] = useState(false);
  const [heroIsVideo, setHeroIsVideo] = useState(false);
  const [heroIsDriveVideo, setHeroIsDriveVideo] = useState(false);
  const [logoInput, setLogoInput] = useState("");
  const [savingHero, setSavingHero] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set("q", searchQ);
      if (searchArtist) params.set("artist", searchArtist);
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQ, searchArtist]);

  const fetchSettings = useCallback(async () => {
    const [heroImg, logo, isVideo, isDriveVid] = await Promise.all([
      getSetting("hero_image"),
      getSetting("hero_logo"),
      getSetting("hero_is_video"),
      getSetting("hero_is_drive_video"),
    ]);
    if (heroImg) setHeroImage(heroImg);
    if (logo) setLogoUrl(logo);
    setHeroIsVideo(isVideo === "true");
    setHeroIsDriveVideo(isDriveVid === "true");
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  useEffect(() => {
    const timer = setTimeout(updateCarouselArrows, 50);
    return () => clearTimeout(timer);
  }, [products, updateCarouselArrows]);

  const handleSaveHero = async () => {
    setSavingHero(true);
    let newImage = heroImageInput.trim();
    const isVideo = newImage ? (heroIsVideo || isVideoUrl(newImage)) : false;
    const isDriveVid = isVideo && heroIsDrive;
    if (newImage && heroIsDrive) {
      newImage = isDriveVid ? toDriveVideoUrl(newImage) : toDriveDirectUrl(newImage);
    }
    await Promise.all([
      updateSetting("hero_image", newImage),
      updateSetting("hero_is_video", isVideo ? "true" : "false"),
      updateSetting("hero_is_drive_video", isDriveVid ? "true" : "false"),
    ]);
    setHeroImage(newImage || DEFAULT_HERO_IMAGE);
    setHeroIsVideo(isVideo);
    setHeroIsDriveVideo(isDriveVid);

    const newLogo = logoInput.trim();
    await updateSetting("hero_logo", newLogo);
    setLogoUrl(newLogo || "/logo.png");

    setSavingHero(false);
    setShowHeroEdit(false);
    setHeroIsDrive(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <AdminOverlay onRefresh={fetchProducts} onAuthChange={setAdminAuthed} />
      <Navbar />

      {/* Hero Banner Section */}
      <section
        className={`relative overflow-hidden h-[calc(100vh-64px)] sm:h-[90vh] min-h-[500px] sm:min-h-[600px] ${
          heroIsVideo ? "" : "bg-fixed bg-cover bg-center"
        }`}
        style={heroIsVideo ? undefined : { backgroundImage: `url('${heroImage}')` }}
      >
        {/* Video background */}
        {heroIsVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={heroImage}
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/70 via-[#000000]/50 to-[#000000]/80" />

        {/* Admin edit banner button */}
        {adminAuthed && (
          <button
            onClick={() => {
              setHeroImageInput(
                heroImage === DEFAULT_HERO_IMAGE ? "" : heroImage,
              );
              setLogoInput(logoUrl === "/logo.png" ? "" : logoUrl);
              setHeroIsDrive(false);
              setShowHeroEdit(true);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[#000000]/80 hover:bg-[#000000] text-[#ffffff] px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar Banner
          </button>
        )}

        {/* Hero edit modal */}
        {showHeroEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#000000]">
                  Editar Banner
                </h2>
                <button
                  onClick={() => setShowHeroEdit(false)}
                  className="text-[#666666]/50 hover:text-[#000000] text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <label className="block text-sm font-medium text-[#666666] mb-1">
                URL de Imagen / Video de Fondo
              </label>
              <input
                type="url"
                value={heroImageInput}
                onChange={(e) => setHeroImageInput(e.target.value)}
                placeholder={heroIsDrive ? "https://drive.google.com/file/d/..." : DEFAULT_HERO_IMAGE}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-1 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
              />
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={heroIsDrive} onChange={(e) => setHeroIsDrive(e.target.checked)} className="rounded" />
                  <span className="text-xs text-[#666666]">Es Drive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={heroIsVideo} onChange={(e) => setHeroIsVideo(e.target.checked)} className="rounded" />
                  <span className="text-xs text-[#666666]">Es Video (MP4)</span>
                </label>
              </div>

              <label className="block text-sm font-medium text-[#666666] mb-1">
                URL del Logo
              </label>
              <input
                type="url"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="/logo.png"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
              />

              <p className="text-xs text-[#666666]/50 mb-4">
                Dejá vacío para usar los valores por defecto.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowHeroEdit(false)}
                  className="flex-1 py-3 border border-gray-200 text-[#666666] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveHero}
                  disabled={savingHero}
                  className="flex-1 py-3 bg-[#000000] text-[#ffffff] font-bold rounded-xl hover:bg-[#666666] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingHero ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f5f5f5]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.5 }}
            style={{ willChange: "transform, opacity" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-3 sm:mb-4">
              {searchQ ? `"${searchQ}"` : "Colección"}
            </h2>
            {(searchQ || searchArtist) && (
              <a
                href="/"
                className="inline-block text-xs tracking-widest uppercase text-[#666666] hover:text-[#000000] transition-colors mb-3 border-b border-[#666666]/40"
              >
                × Limpiar filtro
              </a>
            )}
            {!searchQ && !searchArtist && (
              <p className="text-lg sm:text-xl text-[#666666] max-w-2xl mx-auto px-4">
                Drops limitados y prendas con identidad propia
              </p>
            )}
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ffffff]"></div>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-[#666666]">
                No hay productos disponibles en este momento.
              </p>
              <p className="text-[#666666]/70 mt-2">
                El próximo drop viene pronto. Quedate atento.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="relative">
                {/* Left arrow */}
                <button
                  onClick={() => scrollCarousel("left")}
                  disabled={!carouselCanLeft}
                  aria-label="Anterior"
                  className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none transition-opacity cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Carousel track */}
                <div
                  ref={carouselRef}
                  onScroll={updateCarouselArrows}
                  className="flex overflow-x-auto hide-scrollbar"
                >
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3 flex flex-col"
                    >
                      <ProductCard
                        {...product}
                        index={index}
                        adminMode={adminAuthed}
                        onDeleted={fetchProducts}
                        onEdit={() => setEditingProduct(product)}
                      />
                    </div>
                  ))}
                  {adminAuthed && (
                    <div className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3">
                      <AddProductCard onClick={() => setShowAddForm(true)} />
                    </div>
                  )}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => scrollCarousel("right")}
                  disabled={!carouselCanRight}
                  aria-label="Siguiente"
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none transition-opacity cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              {/* Add product modal */}
              {showAddForm && (
                <AddProductModal
                  onClose={() => setShowAddForm(false)}
                  onCreated={() => {
                    setShowAddForm(false);
                    fetchProducts();
                  }}
                />
              )}
              {/* Edit product modal */}
              {editingProduct && (
                <AddProductModal
                  product={editingProduct}
                  onClose={() => setEditingProduct(null)}
                  onCreated={() => {
                    setEditingProduct(null);
                    fetchProducts();
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
