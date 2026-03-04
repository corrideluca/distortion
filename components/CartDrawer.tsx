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
          `- ${i.name} × ${i.qty} ($${i.price.toLocaleString()} c/u)`
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
      {/* Backdrop */}
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

      {/* Drawer panel — always mounted, slides in/out */}
      <motion.div
        initial={false}
        animate={{ x: cartOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[90] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-black text-white">
          <span className="font-bold text-base tracking-tight">
            Carrito ({totalItems})
          </span>
          <div className="flex items-center gap-3">
            {state.items.length > 0 && (
              <button
                onClick={() => dispatch({ type: "CLEAR" })}
                className="text-xs text-white/60 hover:text-white transition-colors underline underline-offset-2 cursor-pointer"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer text-xl leading-none"
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-black/40">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-sm font-medium">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {state.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b border-black/[0.07] pb-4 last:border-0"
                >
                  {/* Thumbnail */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                  />

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-black/50 mt-0.5">
                      ${item.price.toLocaleString()} c/u
                    </p>
                    <p className="text-sm font-mono font-bold text-black mt-1">
                      ${(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  {/* Qty controls + remove */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          payload: { id: item.id },
                        })
                      }
                      className="text-black/30 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Eliminar"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "DECREMENT",
                            payload: { id: item.id },
                          })
                        }
                        className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-sm hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "INCREMENT",
                            payload: { id: item.id },
                          })
                        }
                        className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-sm hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-5 py-4 border-t border-black/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60">Total</span>
              <span className="text-xl font-bold font-mono">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98] transition-transform"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hacer pedido por WhatsApp
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
