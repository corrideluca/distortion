"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#301014] min-h-screen relative overflow-hidden pt-32">
        {/* Sofia's photo — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5">
          <Image
            src="/sofia.jpeg"
            fill
            alt="Sofía"
            className="object-cover object-top"
            priority
          />
          {/* Fade into background from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#301014] via-[#301014]/40 to-transparent" />
          {/* Fade from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#301014]/60 via-transparent to-transparent" />
        </div>

        {/* Text content */}
        <div className="relative flex items-end min-h-screen pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20">
          <div className="w-full max-w-6xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#F0D7A7] text-xs tracking-[0.35em] uppercase mb-8"
            >
              Quiénes Somos
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[#EDF4ED] text-7xl sm:text-9xl lg:text-[11rem] font-bold leading-none tracking-tight mb-10"
            >
              Soy<br />Sofía.
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="h-px bg-[#F0D7A7]/25 mb-10"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[#F0D7A7]/55 text-lg sm:text-xl max-w-md leading-relaxed"
            >
              Pastelera apasionada. Creadora de momentos memorables.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-28 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.6 }}
            style={{ willChange: "transform, opacity" }}
          >
            <p className="text-[#301014] text-2xl sm:text-3xl font-semibold leading-snug">
              "Estudio pastelería y soy apasionada con la cocina desde muy temprana edad."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            className="lg:pt-4 space-y-5"
          >
            <p className="text-[#51291E]/65 text-base sm:text-lg leading-relaxed">
              Desde que tengo memoria, el olor a vainilla y manteca caliente llenaba mi hogar. Fue en la cocina de mi abuela donde descubrí que hornear no es solo una técnica — es una forma de expresar amor.
            </p>
            <p className="text-[#51291E]/65 text-base sm:text-lg leading-relaxed">
              Hoy, con años de formación y una pasión que crece con cada receta, transformo ingredientes simples en momentos memorables para vos y tu familia.
            </p>
            <p className="text-[#51291E]/65 text-base sm:text-lg leading-relaxed">
              Cada pedido es personal. Cada producto lleva tiempo, dedicación y el mismo amor que ponía mi abuela en su cocina.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-gray-100 px-6 sm:px-12 lg:px-20 pb-20 sm:pb-32">
        <div className="max-w-6xl mx-auto">
          {[
            {
              num: "01",
              title: "Pasión",
              text: "Cada torta, alfajor y brownie es una expresión genuina de amor por la repostería artesanal.",
            },
            {
              num: "02",
              title: "Formación",
              text: "Comprometida con aprender las mejores técnicas para ofrecerte siempre lo más rico.",
            },
            {
              num: "03",
              title: "Calidad",
              text: "Solo ingredientes frescos y de primera calidad, porque el sabor se nota en cada detalle.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ willChange: "transform, opacity" }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-12 py-8 border-b border-gray-100 group cursor-default"
            >
              <span className="text-[#F0D7A7] text-xs font-mono tracking-[0.25em]">{item.num}</span>
              <h3 className="text-[#301014] text-2xl sm:text-3xl font-bold sm:w-36 shrink-0 group-hover:text-[#51291E] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-[#51291E]/55 text-base leading-relaxed max-w-lg">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
