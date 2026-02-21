'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { deleteProduct } from '@/app/actions';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();
  const handleBuyClick = () => {
    const phoneNumber = '5491168801698';
    const message = `Hola! Me gustaría pedir el producto: ${name} ($${price})`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#F0D7A7]/20 hover:border-[#F0D7A7]/50"
    >
      {adminMode && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={() => onEdit?.()}
            className="bg-[#301014] hover:bg-[#51291E] text-[#F0D7A7] w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
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
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          quality={75}
        />
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-[#301014] mb-2">{name}</h3>
        <p className="text-sm sm:text-base text-[#51291E] mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-[#F0D7A7]">
            ${price.toLocaleString()}
          </span>

          <button
            onClick={handleBuyClick}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-[#F0D7A7] hover:bg-[#F5E5C3] text-[#301014] font-semibold text-sm sm:text-base rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
          >
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
