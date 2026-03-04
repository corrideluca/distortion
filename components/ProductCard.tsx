'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { deleteProduct } from '@/app/actions';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  index: number;
  adminMode?: boolean;
  onDeleted?: () => void;
  onEdit?: () => void;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  index,
  adminMode,
  onDeleted,
  onEdit,
}: ProductCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const { dispatch } = useCart();


  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-xl p-3 flex flex-col h-full"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Static base border — always visible */}
      <span className="absolute inset-0 rounded-xl border border-gray-200 pointer-events-none" />

      {/* Animated border on desktop — traces over the base on hover */}
      <span className="hidden md:block pointer-events-none">
        {/* Top */}
        <motion.span
          className="absolute top-0 left-0 h-px bg-[#000000]/30 w-full origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut', delay: hovered ? 0 : 0 }}
        />
        {/* Right */}
        <motion.span
          className="absolute top-0 right-0 w-px bg-[#000000]/30 h-full origin-top"
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut', delay: hovered ? 0.2 : 0 }}
        />
        {/* Bottom */}
        <motion.span
          className="absolute bottom-0 right-0 h-px bg-[#000000]/30 w-full origin-right"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut', delay: hovered ? 0.4 : 0 }}
        />
        {/* Left */}
        <motion.span
          className="absolute bottom-0 left-0 w-px bg-[#000000]/30 h-full origin-bottom"
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut', delay: hovered ? 0.6 : 0 }}
        />
      </span>

      {adminMode && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={() => onEdit?.()}
            className="bg-[#000000] hover:bg-[#666666] text-[#ffffff] w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Editar producto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={async () => {
              if (!confirm(`¿Eliminar "${name}"?`)) return;
              setDeleting(true);
              await deleteProduct(id);
              onDeleted?.();
            }}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Eliminar producto"
          >
            &times;
          </button>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f0f0f0]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          quality={75}
        />
        <div className="absolute inset-0 bg-[#000000]/0 group-hover:bg-[#000000]/10 transition-colors duration-500" />
      </div>

      {/* Info */}
      <div className="pt-4 pb-3 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-bold text-[#000000] group-hover:text-[#666666] transition-colors duration-300 leading-snug line-clamp-2 min-h-[3.5rem]">
          {name}
        </h3>
        <p className="text-[#666666]/50 text-sm mt-1 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        <div className="flex items-center justify-between gap-4 mt-auto pt-4">
          <span className="text-base font-mono tracking-[0.15em] text-[#000000]/60 font-semibold">
            ${price.toLocaleString()}
          </span>
          <button
            onClick={() =>
              dispatch({ type: "ADD_ITEM", payload: { id, name, price, image } })
            }
            className="flex items-center gap-1.5 px-5 py-2 border border-[#000000] text-[#000000] text-sm font-semibold rounded-full hover:bg-[#000000] hover:text-[#ffffff] transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
