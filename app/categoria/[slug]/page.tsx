"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const CATEGORY_MAP: Record<string, string> = {
  remeras: "Remeras",
  hoodies: "Hoodies",
  pantalones: "Pantalones",
  camisas: "Camisas",
  camperas: "Camperas",
  accesorios: "Accesorios",
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string | null;
  checkoutProduct?: { id: string } | null;
  artistId?: string | null;
  artist?: { id: string; name: string } | null;
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
        <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
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

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = CATEGORY_MAP[slug] || slug;

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const isValidCategory = slug in CATEGORY_MAP;

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <p className="text-2xl font-bold text-[#000000] mb-2">Categoría no encontrada</p>
          <p className="text-[#666666] mb-6">Esta categoría no existe.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-[#333] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-2 sm:pb-4 border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl text-[#000000] tracking-wide uppercase"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {categoryName}
          </h1>
        </div>
      </div>

      <section className="py-6 sm:py-8 px-0 sm:px-0">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black/30" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-xl text-[#666666]">
                No hay productos en esta categoría.
              </p>
              <p className="text-[#666666]/70 mt-2">
                El próximo drop viene pronto.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[2px] sm:gap-[3px]">
              {products.map((product, index) => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
