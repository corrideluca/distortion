"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import AdminOverlay, { AddProductCard, AddProductModal } from "@/components/AdminOverlay";
import { getSetting, updateSetting } from "@/app/actions";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop";

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
    if (heroImageInput.trim()) {
      await updateSetting("hero_image", heroImageInput.trim());
      setHeroImage(heroImageInput.trim());
    }
    if (logoInput.trim()) {
      await updateSetting("hero_logo", logoInput.trim());
      setLogoUrl(logoInput.trim());
    }
    setSavingHero(false);
    setShowHeroEdit(false);
  };

  return (
    <div className="min-h-screen bg-[#EDF4ED]">
      <AdminOverlay
        onRefresh={fetchProducts}
        onAuthChange={setAdminAuthed}
      />
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden h-[calc(100vh-64px)] sm:h-[90vh] min-h-[500px] sm:min-h-[600px]">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="SeweetyBella"
            fill
            priority
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            quality={80}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#301014]/70 via-[#301014]/50 to-[#301014]/80"></div>
        </div>

        {/* Admin edit banner button */}
        {adminAuthed && (
          <button
            onClick={() => {
              setHeroImageInput(heroImage === DEFAULT_HERO_IMAGE ? "" : heroImage);
              setLogoInput(logoUrl === "/logo.png" ? "" : logoUrl);
              setShowHeroEdit(true);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[#301014]/80 hover:bg-[#301014] text-[#F0D7A7] px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Banner
          </button>
        )}

        {/* Hero edit modal */}
        {showHeroEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#301014]">Editar Banner</h2>
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
                alt="SeweetyBella"
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
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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

      {/* Custom Orders Section */}
      <section className="relative overflow-hidden bg-[#51291E] py-16 sm:py-24">
        {/* Decorative wave at top */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
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

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#F0D7A7] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#F5E5C3] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6 sm:mb-8"
            >
              <div className="bg-[#F0D7A7] rounded-full p-3 sm:p-4 inline-block">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-[#301014]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EDF4ED] mb-4 sm:mb-6 px-4"
            >
              Pedidos Personalizados
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-[#F0D7A7] mb-8 sm:mb-12 max-w-3xl mx-auto px-4"
            >
              ¿Tenés una ocasión especial? Creamos productos únicos pensados
              especialmente para vos
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-[#301014]/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#F0D7A7]/30 hover:border-[#F0D7A7] transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-[#F0D7A7] rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#301014]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#EDF4ED] mb-2">
                  48 horas
                </h3>
                <p className="text-sm sm:text-base text-[#F0D7A7]">
                  Anticipación mínima para garantizar la mejor calidad
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#301014]/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#F0D7A7]/30 hover:border-[#F0D7A7] transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-[#F0D7A7] rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#301014]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#EDF4ED] mb-2">
                  Personalizado
                </h3>
                <p className="text-sm sm:text-base text-[#F0D7A7]">
                  Diseños únicos adaptados a tu evento o preferencia
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-[#301014]/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#F0D7A7]/30 hover:border-[#F0D7A7] transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-[#F0D7A7] rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#301014]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#EDF4ED] mb-2">
                  Calidad Premium
                </h3>
                <p className="text-sm sm:text-base text-[#F0D7A7]">
                  Ingredientes seleccionados y elaboración artesanal
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a
                href="https://wa.me/5491168801698?text=Hola! Me gustaría hacer un pedido personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-10 sm:py-5 bg-[#F0D7A7] hover:bg-[#F5E5C3] text-[#301014] font-bold text-base sm:text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl cursor-pointer"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden sm:inline">
                  Consultar Pedido Personalizado
                </span>
                <span className="sm:hidden">Pedido Personalizado</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#301014] text-[#EDF4ED] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                <span className="text-[#F0D7A7]">Sweety</span>
                <span className="text-[#EDF4ED]">Bella</span>
              </h3>
              <p className="text-[#F0D7A7] mb-6 sm:mb-8 text-sm sm:text-base">
                Productos artesanales hechos con amor
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* WhatsApp */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#F0D7A7] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <a
                    href="https://wa.me/5491168801698"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F0D7A7] hover:text-[#F5E5C3] transition-colors font-medium text-sm sm:text-base"
                  >
                    +54 9 11 6880-1698
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#F0D7A7] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:contacto@nalabakery.com"
                    className="text-[#F0D7A7] hover:text-[#F5E5C3] transition-colors font-medium text-sm sm:text-base break-all"
                  >
                    contacto@nalabakery.com
                  </a>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#F0D7A7] mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-[#F0D7A7] text-sm sm:text-base">
                    Comodoro Rivadavia 510
                    <br />
                    B1617FLD Gral. Pacheco
                    <br />
                    Provincia de Buenos Aires
                  </span>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="h-[250px] sm:h-[300px] rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.5956788716574!2d-58.63682812345841!3d-34.45926265277037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bca482424b4dd9%3A0x5e7596e48e0fc867!2sComodoro%20Rivadavia%20510%2C%20B1617FLD%20Gral.%20Pacheco%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1706123456789!5m2!1sen!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SeweetyBella Location"
              ></iframe>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-[#F0D7A7]/20">
            <p className="text-[#F0D7A7]/70 text-sm">
              © 2024 SeweetyBella. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
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
