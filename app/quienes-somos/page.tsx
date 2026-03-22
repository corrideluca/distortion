"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#000000] sm:min-h-screen relative overflow-hidden pt-24 sm:pt-32">
        {/* Brand photo — stacked on mobile, absolute on desktop */}
        <div className="relative w-full h-[28rem] sm:absolute sm:right-0 sm:top-0 sm:bottom-0 sm:w-2/5 sm:h-auto">
          <Image
            src="/about.jpg"
            fill
            alt="Distortion"
            className="object-cover object-top"
            priority
          />
          {/* Fade into background from left — desktop only */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/40 to-transparent" />
          {/* Fade from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
        </div>

        {/* Text content */}
        <div className="relative sm:flex sm:items-end sm:min-h-screen pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20 pt-6 sm:pt-0">
          <div className="w-full max-w-6xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#ffffff] text-xs tracking-[0.35em] uppercase mb-8"
            >
              Quiénes Somos
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[#ffffff] text-7xl sm:text-9xl lg:text-[11rem] font-bold leading-none tracking-tight mb-10"
            >
              Somos<br />Distortion.
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="h-px bg-[#ffffff]/25 mb-10"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[#ffffff]/55 text-lg sm:text-xl max-w-md leading-relaxed"
            >
              Cultura musical. Prendas con historia.
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
            <p className="text-[#000000] text-2xl sm:text-3xl font-semibold leading-snug">
              En Distortion diseñamos prendas exclusivas con referencias a la cultura musical que marcó a generaciones enteras.
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
            <p className="text-[#666666]/65 text-base sm:text-lg leading-relaxed">
              Cada prenda está pensada no solo como una pieza de ropa, sino como una forma de expresión personal.
            </p>
            <p className="text-[#666666]/65 text-base sm:text-lg leading-relaxed">
              Lanzamos distintos drops, estos son una serie en la que celebraremos uno a uno a distintos referentes que dejaron huella en la historia del rock, recreando sus prendas originales, manteniendo los cortes y proporciones originales de la época.
            </p>
            <p className="text-[#666666]/65 text-base sm:text-lg leading-relaxed">
              Creemos que vestir es una manera de contar quiénes somos, y por eso nuestras colecciones buscan conectar con quienes valoran la autenticidad, la música y el arte en todas sus formas.
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
              title: "Expresión",
              text: "Cada prenda es una forma de contar quién sos. Diseñamos para quienes visten con identidad.",
            },
            {
              num: "02",
              title: "Música",
              text: "Celebramos a los referentes que dejaron huella en la historia del rock, recreando sus prendas icónicas.",
            },
            {
              num: "03",
              title: "Autenticidad",
              text: "Mantenemos los cortes y proporciones originales de la época. Cada detalle importa.",
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
              <span className="text-[#ffffff] text-xs font-mono tracking-[0.25em]">{item.num}</span>
              <h3 className="text-[#000000] text-2xl sm:text-3xl font-bold sm:w-36 shrink-0 group-hover:text-[#666666] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-[#666666]/55 text-base leading-relaxed max-w-lg">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
