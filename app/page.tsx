"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
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

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop";

const testimonials = [
  { quote: "El rogel es una Bomba 💣💣 ", name: "Virginia Sangiuliano" },
  {
    quote: "Amé la pastafrola!! muy rica, super recomiendo",
    name: "Corrado De Luca",
  },
  { quote: "Las trufas son lo más!", name: "Daniela Imbrogno" },
  { quote: "Muy ricos los alfajorcitoos.", name: "Chiara Adamo Sangiuliano" },
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
      <div className="absolute inset-0 bg-[#301014]/55" />
      <div className="max-w-lg mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase text-white/70 mb-10 text-center"
        >
          Lo que dicen nuestros clientes
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
                <p className="text-lg sm:text-xl font-semibold text-[#301014] leading-snug">
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
                <div className="w-8 h-8 rounded-full bg-[#F0D7A7]/15 border border-[#F0D7A7]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#F0D7A7] text-xs font-bold">
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
                  ? "w-6 h-2 bg-[#F0D7A7]"
                  : "w-2 h-2 bg-[#F0D7A7]/25 hover:bg-[#F0D7A7]/50"
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
}

function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Hero settings
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [showHeroEdit, setShowHeroEdit] = useState(false);
  const [heroImageInput, setHeroImageInput] = useState("");
  const [logoInput, setLogoInput] = useState("");
  const [savingHero, setSavingHero] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    const [heroImg, logo] = await Promise.all([
      getSetting("hero_image"),
      getSetting("hero_logo"),
    ]);
    if (heroImg) setHeroImage(heroImg);
    if (logo) setLogoUrl(logo);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  const handleSaveHero = async () => {
    setSavingHero(true);
    const newImage = heroImageInput.trim();
    await updateSetting("hero_image", newImage);
    setHeroImage(newImage || DEFAULT_HERO_IMAGE);

    const newLogo = logoInput.trim();
    await updateSetting("hero_logo", newLogo);
    setLogoUrl(newLogo || "/logo.png");

    setSavingHero(false);
    setShowHeroEdit(false);
  };

  return (
    <div className="min-h-screen bg-[#EDF4ED]">
      <AdminOverlay onRefresh={fetchProducts} onAuthChange={setAdminAuthed} />
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden h-[calc(100vh-64px)] sm:h-[90vh] min-h-[500px] sm:min-h-[600px] bg-[#301014]">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="SweetyBella"
            fill
            priority
            className="object-cover"
            quality={80}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#301014]/70 via-[#301014]/50 to-[#301014]/80"></div>
        </div>

        {/* Admin edit banner button */}
        {adminAuthed && (
          <button
            onClick={() => {
              setHeroImageInput(
                heroImage === DEFAULT_HERO_IMAGE ? "" : heroImage,
              );
              setLogoInput(logoUrl === "/logo.png" ? "" : logoUrl);
              setShowHeroEdit(true);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[#301014]/80 hover:bg-[#301014] text-[#F0D7A7] px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-2"
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
                <h2 className="text-xl font-bold text-[#301014]">
                  Editar Banner
                </h2>
                <button
                  onClick={() => setShowHeroEdit(false)}
                  className="text-[#51291E]/50 hover:text-[#301014] text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <label className="block text-sm font-medium text-[#51291E] mb-1">
                URL de Imagen de Fondo
              </label>
              <input
                type="url"
                value={heroImageInput}
                onChange={(e) => setHeroImageInput(e.target.value)}
                placeholder={DEFAULT_HERO_IMAGE}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent text-sm"
              />

              <label className="block text-sm font-medium text-[#51291E] mb-1">
                URL del Logo
              </label>
              <input
                type="url"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="/logo.png"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent text-sm"
              />

              <p className="text-xs text-[#51291E]/50 mb-4">
                Dejá vacío para usar los valores por defecto.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowHeroEdit(false)}
                  className="flex-1 py-3 border border-gray-200 text-[#51291E] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveHero}
                  disabled={savingHero}
                  className="flex-1 py-3 bg-[#301014] text-[#F0D7A7] font-bold rounded-xl hover:bg-[#51291E] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingHero ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Image
                src={logoUrl}
                width={200}
                height={100}
                alt="SweetyBella"
                className="object-contain min-w-[25rem] mx-auto"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-2xl lg:text-3xl text-[#EDF4ED] mb-8 sm:mb-10 max-w-3xl mx-auto px-4"
              >
                Productos artesanales hechos con amor y los mejores ingredientes
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <a
                  href="#products"
                  className="inline-block px-8 py-4 sm:px-10 sm:py-5 bg-[#F0D7A7] hover:bg-[#F5E5C3] text-[#301014] font-bold text-base sm:text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl cursor-pointer"
                >
                  Ver Productos
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#EDF4ED"
            />
          </svg>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#EDF4ED]"
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#301014] mb-3 sm:mb-4">
              Nuestros Productos
            </h2>
            <p className="text-lg sm:text-xl text-[#51291E] max-w-2xl mx-auto px-4">
              Descubrí nuestra selección de productos artesanales
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F0D7A7]"></div>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-[#51291E]">
                No hay productos disponibles en este momento.
              </p>
              <p className="text-[#51291E]/70 mt-2">
                Vuelve pronto para ver nuestras novedades.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    index={index}
                    adminMode={adminAuthed}
                    onDeleted={fetchProducts}
                    onEdit={() => setEditingProduct(product)}
                  />
                ))}
                {adminAuthed && (
                  <AddProductCard onClick={() => setShowAddForm(true)} />
                )}
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
