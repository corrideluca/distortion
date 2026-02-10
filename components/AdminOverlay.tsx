"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  login,
  logout,
  checkAuth,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getAdmins,
  createAdmin,
  deleteAdmin,
} from "@/app/actions";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Admin {
  id: string;
  email: string;
  createdAt: Date;
}

export default function AdminOverlay({
  onRefresh,
  onAuthChange,
}: {
  onRefresh: () => void;
  onAuthChange: (authed: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const isAdminRoute = searchParams.has("admin");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "admins">("products");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Inline form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const handleToggle = () => {
    if (!drawerOpen && !authenticated && !checking) {
      setChecking(true);
      checkAuth().then((isAuth) => {
        setAuthenticated(isAuth);
        onAuthChange(isAuth);
        setChecking(false);
        setDrawerOpen(true);
        if (isAuth) loadData();
      });
    } else {
      setDrawerOpen(!drawerOpen);
    }
  };

  const loadData = async () => {
    const [prods, adms] = await Promise.all([getProducts(), getAdmins()]);
    setProducts(prods);
    setAdmins(adms);
  };

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    onAuthChange(false);
    setDrawerOpen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setAuthenticated(true);
      onAuthChange(true);
      loadData();
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    await deleteProduct(id);
    loadData();
    onRefresh();
  };

  const handleDeleteAdmin = async (id: string, adminEmail: string) => {
    if (!confirm(`¿Eliminar admin "${adminEmail}"?`)) return;
    const result = await deleteAdmin(id);
    if (result.error) {
      alert(result.error);
    } else {
      loadData();
    }
  };

  if (!isAdminRoute) return null;

  return (
    <>
      {/* Gear toggle button */}
      <button
        onClick={handleToggle}
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
          authenticated
            ? "bg-[#301014] text-[#F0D7A7] hover:bg-[#51291E]"
            : "bg-white/80 text-[#301014] hover:bg-white border border-[#F0D7A7]/40"
        } ${drawerOpen ? "opacity-0 pointer-events-none" : ""}`}
        title="Admin"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#301014]">
          <h2 className="text-lg font-bold text-[#F0D7A7]">Admin Panel</h2>
          <div className="flex items-center gap-2">
            {authenticated && (
              <button
                onClick={handleLogout}
                className="text-[#F0D7A7]/70 hover:text-[#F0D7A7] text-sm cursor-pointer"
              >
                Salir
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-[#F0D7A7]/70 hover:text-[#F0D7A7] text-2xl leading-none cursor-pointer ml-2"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto">
          {!authenticated ? (
            /* Login form */
            <div className="p-6">
              <p className="text-[#51291E]/70 text-sm text-center mb-6">
                Ingresá tus credenciales
              </p>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#301014] text-[#F0D7A7] font-bold rounded-xl hover:bg-[#51291E] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated: tabs */
            <div>
              {/* Tab bar */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 py-3 text-sm font-semibold text-center cursor-pointer transition-colors ${
                    activeTab === "products"
                      ? "text-[#301014] border-b-2 border-[#301014]"
                      : "text-[#51291E]/50 hover:text-[#51291E]"
                  }`}
                >
                  Productos ({products.length})
                </button>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`flex-1 py-3 text-sm font-semibold text-center cursor-pointer transition-colors ${
                    activeTab === "admins"
                      ? "text-[#301014] border-b-2 border-[#301014]"
                      : "text-[#51291E]/50 hover:text-[#51291E]"
                  }`}
                >
                  Admins ({admins.length})
                </button>
              </div>

              {/* Products tab */}
              {activeTab === "products" && (
                <div className="p-4">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductForm(true);
                    }}
                    className="w-full py-2 mb-4 bg-[#301014] text-[#F0D7A7] font-semibold rounded-xl hover:bg-[#51291E] transition-colors cursor-pointer text-sm"
                  >
                    + Agregar Producto
                  </button>

                  {showProductForm && (
                    <ProductForm
                      product={editingProduct}
                      onClose={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      onSaved={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        loadData();
                        onRefresh();
                      }}
                    />
                  )}

                  <div className="space-y-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <Image
                          width={100}
                          height={60}
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#301014] truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#51291E]/60">
                            ${p.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setShowProductForm(true);
                            }}
                            className="p-2 text-[#51291E]/60 hover:text-[#301014] hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admins tab */}
              {activeTab === "admins" && (
                <div className="p-4">
                  <button
                    onClick={() => setShowAdminForm(true)}
                    className="w-full py-2 mb-4 bg-[#301014] text-[#F0D7A7] font-semibold rounded-xl hover:bg-[#51291E] transition-colors cursor-pointer text-sm"
                  >
                    + Agregar Admin
                  </button>

                  {showAdminForm && (
                    <AdminForm
                      onClose={() => setShowAdminForm(false)}
                      onSaved={() => {
                        setShowAdminForm(false);
                        loadData();
                      }}
                    />
                  )}

                  <div className="space-y-2">
                    {admins.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#301014] text-[#F0D7A7] flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {a.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#301014] truncate">
                            {a.email}
                          </p>
                          <p className="text-xs text-[#51291E]/60">
                            {new Date(a.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAdmin(a.id, a.email)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors flex-shrink-0"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---- Inline product form ---- */
function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#301014]">
          {isEdit ? "Editar Producto" : "Nuevo Producto"}
        </h3>
        <button onClick={onClose} className="text-[#51291E]/50 hover:text-[#301014] cursor-pointer text-lg leading-none">
          &times;
        </button>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 text-xs rounded-lg p-2 mb-3">{error}</div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          const result = isEdit
            ? await updateProduct(product.id, formData)
            : await createProduct(formData);
          setLoading(false);
          if (result.error) {
            setError(result.error);
          } else {
            onSaved();
          }
        }}
      >
        <input
          name="name"
          defaultValue={product?.name ?? ""}
          required
          placeholder="Nombre"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7]"
        />
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          required
          placeholder="Descripción"
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] resize-none"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price ?? ""}
          required
          placeholder="Precio"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7]"
        />
        <input
          name="image"
          type="url"
          defaultValue={product?.image ?? ""}
          required
          placeholder="URL de imagen"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 text-sm text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#301014] text-[#F0D7A7] font-semibold rounded-lg hover:bg-[#51291E] transition-colors disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading
            ? isEdit
              ? "Guardando..."
              : "Creando..."
            : isEdit
            ? "Guardar Cambios"
            : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}

/* ---- Inline admin form ---- */
function AdminForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#301014]">Nuevo Admin</h3>
        <button onClick={onClose} className="text-[#51291E]/50 hover:text-[#301014] cursor-pointer text-lg leading-none">
          &times;
        </button>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 text-xs rounded-lg p-2 mb-3">{error}</div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const result = await createAdmin(formEmail, formPassword);
          setLoading(false);
          if (result.error) {
            setError(result.error);
          } else {
            onSaved();
          }
        }}
      >
        <input
          type="email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7]"
        />
        <input
          type="password"
          value={formPassword}
          onChange={(e) => setFormPassword(e.target.value)}
          required
          placeholder="Contraseña"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 text-sm text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#301014] text-[#F0D7A7] font-semibold rounded-lg hover:bg-[#51291E] transition-colors disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? "Creando..." : "Crear Admin"}
        </button>
      </form>
    </div>
  );
}

/* ---- Exported components for page.tsx ---- */
export function AddProductCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white/50 shadow-lg border-2 border-dashed border-[#F0D7A7]/50 hover:border-[#F0D7A7] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] hover:shadow-2xl"
    >
      <div className="bg-[#F0D7A7]/20 group-hover:bg-[#F0D7A7]/30 rounded-full w-16 h-16 flex items-center justify-center mb-4 transition-colors">
        <svg
          className="w-8 h-8 text-[#301014]/60 group-hover:text-[#301014] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-[#301014]/60 group-hover:text-[#301014] font-medium transition-colors">
        Agregar Producto
      </p>
    </div>
  );
}

export function AddProductModal({
  onClose,
  onCreated,
  product,
}: {
  onClose: () => void;
  onCreated: () => void;
  product?: Product | null;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#301014]">
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#51291E]/50 hover:text-[#301014] text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const formData = new FormData(e.currentTarget);
            const result = isEdit
              ? await updateProduct(product.id, formData)
              : await createProduct(formData);
            setLoading(false);
            if (result.error) {
              setError(result.error);
            } else {
              onCreated();
            }
          }}
        >
          <label className="block text-sm font-medium text-[#51291E] mb-1">Nombre</label>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent"
          />
          <label className="block text-sm font-medium text-[#51291E] mb-1">Descripción</label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent resize-none"
          />
          <label className="block text-sm font-medium text-[#51291E] mb-1">Precio</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price ?? ""}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent"
          />
          <label className="block text-sm font-medium text-[#51291E] mb-1">URL de Imagen</label>
          <input
            name="image"
            type="url"
            defaultValue={product?.image ?? ""}
            required
            placeholder="https://..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#301014] focus:outline-none focus:ring-2 focus:ring-[#F0D7A7] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#301014] text-[#F0D7A7] font-bold rounded-xl hover:bg-[#51291E] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? isEdit ? "Guardando..." : "Creando..."
              : isEdit ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
