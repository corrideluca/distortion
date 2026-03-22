"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice, cartOpen, setCartOpen } =
    useCart();

  const handleWhatsApp = () => {
    if (state.items.length === 0) return;
    const lines = state.items
      .map(
        (i) =>
          `- ${i.name}${i.size ? ` (${i.size})` : ""} × ${i.qty} ($${i.price.toLocaleString()} c/u)`
      )
      .join("\n");
    const message = `Hola! Me gustaría pedir:\n${lines}\nTotal: $${totalPrice.toLocaleString()}`;
    window.open(
      `https://wa.me/5491160286919?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[80]"
            onClick={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: cartOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[90] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-lg font-bold text-black uppercase tracking-wide">
            Cart
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center border border-black/30 cursor-pointer hover:border-black transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="w-full h-px bg-black/10" />

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-black/30">
              <p className="text-sm uppercase tracking-wide">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-5">
              {state.items.map((item) => (
                <div
                  key={`${item.id}__${item.size ?? ""}`}
                  className="flex items-start gap-4"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={80}
                    className="w-16 h-20 object-cover flex-shrink-0 bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black uppercase leading-snug">
                      {item.name}
                    </p>
                    {item.size && (
                      <p className="text-sm text-black/50 mt-0.5">
                        {item.size}
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-black">
                      ${(item.price * item.qty).toLocaleString()} (x{item.qty})
                    </p>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          payload: { id: item.id, size: item.size },
                        })
                      }
                      className="text-xs text-black/30 hover:text-black underline mt-1 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-6 pb-6">
            <div className="border-t border-black/10 pt-4 space-y-1.5 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/60 text-right flex-1 mr-6">Subtotal</span>
                <span className="text-sm text-black">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/60 text-right flex-1 mr-6">Total</span>
                <span className="text-sm font-medium text-black">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full py-4 border border-black text-black text-sm uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center justify-between px-5"
            >
              <span>Hacer pedido</span>
              <span>${totalPrice.toLocaleString()}</span>
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
