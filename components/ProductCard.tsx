'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  index: number;
}

export default function ProductCard({
  name,
  description,
  price,
  image,
  index,
}: ProductCardProps) {
  const handleBuyClick = () => {
    const phoneNumber = '5491168801698';
    const message = `Hola! Me gustaría pedir el producto: ${name} ($${price})`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#F0D7A7]/20 hover:border-[#F0D7A7]/50"
    >
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#EDF4ED]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
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
