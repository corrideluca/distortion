"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CheckoutData {
  id: string;
  images: string[];
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    sizes: string[];
    artist?: { id: string; name: string } | null;
  };
}

export default function CheckoutPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  useEffect(() => {
    fetch(`/api/checkout/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && !d.error) setData(d);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!data || !selectedSize) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: data.product.id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image,
        size: selectedSize,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black/20" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <p className="text-2xl font-bold text-black mb-2">
            Producto no encontrado
          </p>
          <p className="text-[#666] mb-6">
            Este producto no existe o fue eliminado.
          </p>
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

  const { product, images } = data;
  // Use checkout images if available, otherwise fall back to main product image
  const allImages = images.length > 0 ? images : [product.image];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-16 sm:pt-20">
        {/* Mobile layout: stacked */}
        <div className="lg:hidden">
          {/* Images */}
          <div className="space-y-1">
            {allImages.map((img, i) => (
              <div key={i} className="relative w-full aspect-[3/4] bg-[#f5f5f5]">
                <Image
                  src={img}
                  alt={`${product.name} - ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                  quality={90}
                />
              </div>
            ))}
          </div>

          {/* Product info */}
          <div className="px-4 py-8">
            {product.artist && (
              <p className="text-xs text-[#999] uppercase tracking-widest mb-3">
                {product.artist.name}
              </p>
            )}
            <h1 className="text-lg font-semibold text-black uppercase tracking-wide">
              {product.name}
            </h1>
            <p className="text-base text-black mt-2">
              ${product.price.toLocaleString()}
            </p>

            {product.description && (
              <p className="text-sm text-[#666] mt-4 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size picker */}
            {product.sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-black mb-3">
                  Size:{" "}
                  {selectedSize && (
                    <span className="font-medium">{selectedSize}</span>
                  )}
                </p>
                <div className="flex gap-3">
                  {["XS", "S", "M", "L", "XL"].map((size) => {
                    const available = product.sizes.includes(size);
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`w-12 h-12 text-sm border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : available
                              ? "border-black/20 text-black hover:border-black"
                              : "border-black/10 text-black/20 line-through cursor-not-allowed"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || added}
              className={`w-full mt-8 py-4 border text-sm uppercase tracking-widest font-medium transition-all cursor-pointer ${
                added
                  ? "border-green-600 text-green-600"
                  : selectedSize
                    ? "border-black text-black hover:bg-black hover:text-white"
                    : "border-black/20 text-black/30 cursor-not-allowed"
              }`}
            >
              {added ? "AGREGADO" : selectedSize ? "AGREGAR AL CARRITO" : "SELECCIONAR TALLE"}
            </button>
          </div>
        </div>

        {/* Desktop layout: split view */}
        <div className="hidden lg:flex min-h-[calc(100vh-5rem)]">
          {/* Left: Scrollable images */}
          <div className="w-1/2 overflow-y-auto">
            {allImages.map((img, i) => (
              <div key={i} className="relative w-full aspect-[3/4] bg-[#f5f5f5]">
                <Image
                  src={img}
                  alt={`${product.name} - ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={i === 0}
                  quality={90}
                />
              </div>
            ))}
          </div>

          {/* Right: Fixed product info */}
          <div className="w-1/2 sticky top-20 h-[calc(100vh-5rem)] flex flex-col justify-center px-12 xl:px-20">
            {product.artist && (
              <p className="text-xs text-[#999] uppercase tracking-widest mb-4">
                {product.artist.name}
              </p>
            )}

            <h1 className="text-xl font-semibold text-black uppercase tracking-wide">
              {product.name}
            </h1>

            <p className="text-base text-black mt-3">
              ${product.price.toLocaleString()}
            </p>

            {product.description && (
              <p className="text-sm text-[#666] mt-6 leading-relaxed max-w-md">
                {product.description}
              </p>
            )}

            {/* Size picker */}
            {product.sizes.length > 0 && (
              <div className="mt-10">
                <p className="text-sm text-black mb-3">
                  Size:{" "}
                  {selectedSize && (
                    <span className="font-medium">{selectedSize}</span>
                  )}
                </p>
                <div className="flex gap-3">
                  {["XS", "S", "M", "L", "XL"].map((size) => {
                    const available = product.sizes.includes(size);
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`w-12 h-12 text-sm border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : available
                              ? "border-black/20 text-black hover:border-black"
                              : "border-black/10 text-black/20 line-through cursor-not-allowed"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || added}
              className={`w-full max-w-md mt-10 py-4 border text-sm uppercase tracking-widest font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                added
                  ? "border-green-600 text-green-600"
                  : selectedSize
                    ? "border-black text-black hover:bg-black hover:text-white"
                    : "border-black/20 text-black/30 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {added ? "AGREGADO" : selectedSize ? "ADD TO CART" : "SELECCIONAR TALLE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
