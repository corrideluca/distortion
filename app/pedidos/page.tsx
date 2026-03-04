"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    num: "01",
    title: "Contactanos",
    text: "Mandanos un mensaje por WhatsApp contando qué prenda querés, el diseño que tenés en mente y tu talle.",
  },
  {
    num: "02",
    title: "Coordinamos",
    text: "Te confirmamos disponibilidad, precio y todos los detalles del pedido para que quede exactamente como lo imaginaste.",
  },
  {
    num: "03",
    title: "Lo hacemos",
    text: "Producimos tu prenda con los mejores materiales. Los pedidos custom tienen un plazo de entrega de 7 a 10 días hábiles.",
  },
];

export default function Pedidos() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#111111] min-h-[80vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20 pt-32">
        <div className="w-full max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#ffffff] text-xs tracking-[0.35em] uppercase mb-8"
          >
            Pedidos Personalizados
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#ffffff] text-6xl sm:text-9xl lg:text-[10rem] font-bold leading-none tracking-tight mb-10"
          >
            Tu prenda,<br />tu diseño.
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
            Remeras, hoodies y más — diseñados y producidos especialmente para vos.
          </motion.p>
        </div>
      </section>

      {/* Intro */}
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
              &ldquo;¿Tenés una idea? La hacemos realidad. Cada pedido custom es único.&rdquo;
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
            <p className="text-[#111111]/65 text-base sm:text-lg leading-relaxed">
              Todo empieza con un mensaje. Contanos qué tenés en mente, el talle, los colores y el diseño. Coordinamos cada detalle para que tu prenda salga exactamente como la imaginaste.
            </p>
            <p className="text-[#111111]/65 text-base sm:text-lg leading-relaxed">
              Trabajamos con telas de calidad y procesos de estampado duraderos, porque sabemos que una buena remera tiene que bancarse el tiempo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-gray-100 px-6 sm:px-12 lg:px-20 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          {steps.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ willChange: "transform, opacity" }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-20 py-8 border-b border-gray-100 group cursor-default"
            >
              <span className="text-[#ffffff] text-xs font-mono tracking-[0.25em]">{item.num}</span>
              <h3 className="text-[#000000] text-2xl sm:text-3xl font-bold sm:w-36 shrink-0 group-hover:text-[#111111] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-[#111111]/55 text-base leading-relaxed max-w-lg">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-12 lg:px-20 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.a
            href="https://wa.me/5491160286919?text=Hola! Me gustaría hacer un pedido personalizado de Distortion"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.5 }}
            style={{ willChange: "transform, opacity" }}
            className="inline-flex items-center gap-3 bg-[#000000] hover:bg-[#111111] text-[#ffffff] font-bold text-lg px-8 py-4 rounded-full transition-colors duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hacer un pedido
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
