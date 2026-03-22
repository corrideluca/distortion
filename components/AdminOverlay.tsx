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
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  getCheckoutProduct,
  updateCheckoutImages,
} from "@/app/actions";
import Image from "next/image";

function toDriveDirectUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : url.trim();
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes?: string[];
  artistId?: string | null;
  artist?: { id: string; name: string } | null;
}

interface Artist {
  id: string;
  name: string;
  slug?: string | null;
  bio?: string | null;
  image?: string | null;
  createdAt: Date;
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
  const [activeTab, setActiveTab] = useState<"products" | "artists" | "admins">("products");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [imagesProduct, setImagesProduct] = useState<Product | null>(null);

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
    const [prods, arts, adms] = await Promise.all([getProducts(), getArtists(), getAdmins()]);
    setProducts(prods as Product[]);
    setArtists(arts as Artist[]);
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

  const handleDeleteArtist = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar artista "${name}"? Los productos asociados quedarán sin artista.`)) return;
    await deleteArtist(id);
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
      <button
        onClick={handleToggle}
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
          authenticated
            ? "bg-[#000000] text-[#ffffff] hover:bg-[#333333]"
            : "bg-white/80 text-[#000000] hover:bg-white border border-gray-300"
        } ${drawerOpen ? "opacity-0 pointer-events-none" : ""}`}
        title="Admin"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#000000]">
          <h2 className="text-lg font-bold text-[#ffffff]">Admin Panel</h2>
          <div className="flex items-center gap-2">
            {authenticated && (
              <button onClick={handleLogout} className="text-[#ffffff]/70 hover:text-[#ffffff] text-sm cursor-pointer">
                Salir
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-[#ffffff]/70 hover:text-[#ffffff] text-2xl leading-none cursor-pointer ml-2"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!authenticated ? (
            <div className="p-6">
              <p className="text-[#666666] text-sm text-center mb-6">Ingresá tus credenciales</p>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#000000] text-[#ffffff] font-bold rounded-xl hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Tab bar */}
              <div className="flex border-b border-gray-200">
                {(["products", "artists", "admins"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold text-center cursor-pointer transition-colors ${
                      activeTab === tab
                        ? "text-[#000000] border-b-2 border-[#000000]"
                        : "text-[#666666] hover:text-[#000000]"
                    }`}
                  >
                    {tab === "products" ? `Productos (${products.length})` : tab === "artists" ? `Artistas (${artists.length})` : `Admins (${admins.length})`}
                  </button>
                ))}
              </div>

              {/* Products tab */}
              {activeTab === "products" && (
                <div className="p-4">
                  <button
                    onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                    className="w-full py-2 mb-4 bg-[#000000] text-[#ffffff] font-semibold rounded-xl hover:bg-[#333333] transition-colors cursor-pointer text-sm"
                  >
                    + Agregar Producto
                  </button>
                  {showProductForm && (
                    <ProductForm
                      product={editingProduct}
                      artists={artists}
                      onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
                      onSaved={() => { setShowProductForm(false); setEditingProduct(null); loadData(); onRefresh(); }}
                    />
                  )}
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Image width={100} height={60} src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#000000] truncate">{p.name}</p>
                          <p className="text-xs text-[#666666]">
                            ${p.price.toLocaleString()}{p.artist ? ` · ${p.artist.name}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setImagesProduct(p)}
                            className="p-2 text-[#666666] hover:text-[#000000] hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                            title="Imágenes checkout"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                            className="p-2 text-[#666666] hover:text-[#000000] hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {imagesProduct && (
                    <CheckoutImagesModal
                      product={imagesProduct}
                      onClose={() => setImagesProduct(null)}
                    />
                  )}
                </div>
              )}

              {/* Artists tab */}
              {activeTab === "artists" && (
                <div className="p-4">
                  <button
                    onClick={() => { setEditingArtist(null); setShowArtistForm(true); }}
                    className="w-full py-2 mb-4 bg-[#000000] text-[#ffffff] font-semibold rounded-xl hover:bg-[#333333] transition-colors cursor-pointer text-sm"
                  >
                    + Agregar Artista
                  </button>
                  {showArtistForm && (
                    <ArtistForm
                      artist={editingArtist}
                      onClose={() => { setShowArtistForm(false); setEditingArtist(null); }}
                      onSaved={() => { setShowArtistForm(false); setEditingArtist(null); loadData(); }}
                    />
                  )}
                  <div className="space-y-2">
                    {artists.map((a) => (
                      <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {a.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#000000] truncate">{a.name}</p>
                          {a.bio && <p className="text-xs text-[#666666] truncate">{a.bio}</p>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => { setEditingArtist(a); setShowArtistForm(true); }}
                            className="p-2 text-[#666666] hover:text-[#000000] hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteArtist(a.id, a.name)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
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
                    className="w-full py-2 mb-4 bg-[#000000] text-[#ffffff] font-semibold rounded-xl hover:bg-[#333333] transition-colors cursor-pointer text-sm"
                  >
                    + Agregar Admin
                  </button>
                  {showAdminForm && (
                    <AdminForm
                      onClose={() => setShowAdminForm(false)}
                      onSaved={() => { setShowAdminForm(false); loadData(); }}
                    />
                  )}
                  <div className="space-y-2">
                    {admins.map((a) => (
                      <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {a.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#000000] truncate">{a.email}</p>
                          <p className="text-xs text-[#666666]">{new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAdmin(a.id, a.email)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors flex-shrink-0"
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

/* ---- Product form ---- */
function ProductForm({
  product,
  artists,
  onClose,
  onSaved,
}: {
  product: Product | null;
  artists: Artist[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDrive, setIsDrive] = useState(false);
  const isEdit = !!product;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#000000]">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h3>
        <button onClick={onClose} className="text-[#666666] hover:text-[#000000] cursor-pointer text-lg leading-none">&times;</button>
      </div>
      {error && <div className="bg-red-50 text-red-600 text-xs rounded-lg p-2 mb-3">{error}</div>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          if (isDrive) {
            const raw = formData.get("image") as string;
            formData.set("image", toDriveDirectUrl(raw));
          }
          const result = isEdit ? await updateProduct(product.id, formData) : await createProduct(formData);
          setLoading(false);
          if (result.error) setError(result.error);
          else onSaved();
        }}
      >
        <input name="name" defaultValue={product?.name ?? ""} required placeholder="Nombre"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400" />
        <textarea name="description" defaultValue={product?.description ?? ""} required placeholder="Descripción" rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
        <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price ?? ""} required placeholder="Precio"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400" />
        <input name="image" type="url" defaultValue={product?.image ?? ""} required
          placeholder={isDrive ? "https://drive.google.com/file/d/..." : "URL de imagen"}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-1 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400" />
        <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
          <input type="checkbox" checked={isDrive} onChange={(e) => setIsDrive(e.target.checked)} className="rounded" />
          <span className="text-xs text-[#666666]">Es Drive (convierte al URL directo)</span>
        </label>
        <select name="artistId" defaultValue={product?.artistId ?? ""}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white">
          <option value="">Sin artista</option>
          {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <button type="submit" disabled={loading}
          className="w-full py-2 bg-[#000000] text-[#ffffff] font-semibold rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer text-sm">
          {loading ? (isEdit ? "Guardando..." : "Creando...") : (isEdit ? "Guardar Cambios" : "Crear Producto")}
        </button>
      </form>
    </div>
  );
}

/* ---- Artist form ---- */
function toSlugPreview(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function ArtistForm({
  artist,
  onClose,
  onSaved,
}: {
  artist: Artist | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDrive, setIsDrive] = useState(false);
  const [slugValue, setSlugValue] = useState(artist?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!artist?.slug);
  const isEdit = !!artist;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#000000]">{isEdit ? "Editar Artista" : "Nuevo Artista"}</h3>
        <button onClick={onClose} className="text-[#666666] hover:text-[#000000] cursor-pointer text-lg leading-none">&times;</button>
      </div>
      {error && <div className="bg-red-50 text-red-600 text-xs rounded-lg p-2 mb-3">{error}</div>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          if (isDrive) {
            const raw = formData.get("image") as string;
            if (raw) formData.set("image", toDriveDirectUrl(raw));
          }
          const result = isEdit ? await updateArtist(artist.id, formData) : await createArtist(formData);
          setLoading(false);
          if (result.error) setError(result.error);
          else onSaved();
        }}
      >
        <input
          name="name"
          defaultValue={artist?.name ?? ""}
          required
          placeholder="Nombre"
          onChange={(e) => {
            if (!slugTouched) setSlugValue(toSlugPreview(e.target.value));
          }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <div className="mb-2">
          <input
            name="slug"
            value={slugValue}
            placeholder="slug-url (auto)"
            onChange={(e) => { setSlugValue(e.target.value); setSlugTouched(true); }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <p className="text-[10px] text-[#999] mt-0.5 px-1">
            URL: /artistas/{slugValue || "auto"}
          </p>
        </div>
        <textarea name="bio" defaultValue={artist?.bio ?? ""} placeholder="Bio (opcional)" rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
        <input name="image" type="url" defaultValue={artist?.image ?? ""}
          placeholder={isDrive ? "https://drive.google.com/file/d/..." : "URL de imagen hero (opcional)"}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-1 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400" />
        <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
          <input type="checkbox" checked={isDrive} onChange={(e) => setIsDrive(e.target.checked)} className="rounded" />
          <span className="text-xs text-[#666666]">Es Drive (convierte al URL directo)</span>
        </label>
        <button type="submit" disabled={loading}
          className="w-full py-2 bg-[#000000] text-[#ffffff] font-semibold rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer text-sm">
          {loading ? (isEdit ? "Guardando..." : "Creando...") : (isEdit ? "Guardar Cambios" : "Crear Artista")}
        </button>
      </form>
    </div>
  );
}

/* ---- Admin form ---- */
function AdminForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#000000]">Nuevo Admin</h3>
        <button onClick={onClose} className="text-[#666666] hover:text-[#000000] cursor-pointer text-lg leading-none">&times;</button>
      </div>
      {error && <div className="bg-red-50 text-red-600 text-xs rounded-lg p-2 mb-3">{error}</div>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const result = await createAdmin(formEmail, formPassword);
          setLoading(false);
          if (result.error) setError(result.error);
          else onSaved();
        }}
      >
        <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="Email"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400" />
        <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required placeholder="Contraseña"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400" />
        <button type="submit" disabled={loading}
          className="w-full py-2 bg-[#000000] text-[#ffffff] font-semibold rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer text-sm">
          {loading ? "Creando..." : "Crear Admin"}
        </button>
      </form>
    </div>
  );
}

/* ---- Exported helpers for page.tsx ---- */
export function AddProductCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white/50 shadow-lg border-2 border-dashed border-gray-300 hover:border-gray-600 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] hover:shadow-2xl"
    >
      <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mb-4 transition-colors">
        <svg className="w-8 h-8 text-[#000000]/60 group-hover:text-[#000000] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-[#000000]/60 group-hover:text-[#000000] font-medium transition-colors">Agregar Producto</p>
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
  const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDrive, setIsDrive] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? ALL_SIZES);
  const isEdit = !!product;

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    fetch("/api/artists")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setArtists(data))
      .catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#000000]">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} className="text-[#666666] hover:text-[#000000] text-2xl leading-none cursor-pointer">&times;</button>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const formData = new FormData(e.currentTarget);
            if (isDrive) {
              const raw = formData.get("image") as string;
              formData.set("image", toDriveDirectUrl(raw));
            }
            formData.set("sizes", JSON.stringify(sizes));
            const result = isEdit ? await updateProduct(product.id, formData) : await createProduct(formData);
            setLoading(false);
            if (result.error) setError(result.error);
            else onCreated();
          }}
        >
          <label className="block text-sm font-medium text-[#666666] mb-1">Nombre</label>
          <input name="name" defaultValue={product?.name ?? ""} required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          <label className="block text-sm font-medium text-[#666666] mb-1">Descripción</label>
          <textarea name="description" defaultValue={product?.description ?? ""} required rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none" />
          <label className="block text-sm font-medium text-[#666666] mb-1">Precio</label>
          <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price ?? ""} required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          <label className="block text-sm font-medium text-[#666666] mb-1">URL de Imagen</label>
          <input name="image" type="url" defaultValue={product?.image ?? ""} required
            placeholder={isDrive ? "https://drive.google.com/file/d/..." : "https://..."}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-1 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
            <input type="checkbox" checked={isDrive} onChange={(e) => setIsDrive(e.target.checked)} className="rounded" />
            <span className="text-xs text-[#666666]">Es Drive (convierte al URL directo)</span>
          </label>
          <label className="block text-sm font-medium text-[#666666] mb-1">Artista</label>
          <select name="artistId" defaultValue={product?.artistId ?? ""}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-[#000000] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white">
            <option value="">Sin artista</option>
            {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <label className="block text-sm font-medium text-[#666666] mb-2">Talles disponibles</label>
          <div className="flex gap-2 mb-4">
            {ALL_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                  sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-white text-[#999] border-gray-200 line-through"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#000000] text-[#ffffff] font-bold rounded-xl hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer">
            {loading ? (isEdit ? "Guardando..." : "Creando...") : (isEdit ? "Guardar Cambios" : "Crear Producto")}
          </button>
        </form>
      </div>
    </div>
  );
}

function CheckoutImagesModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDrive, setIsDrive] = useState(false);

  useEffect(() => {
    getCheckoutProduct(product.id).then((cp) => {
      if (cp) setImages(cp.images);
      else setImages([product.image]);
      setLoading(false);
    });
  }, [product.id, product.image]);

  const handleAdd = () => {
    let url = newUrl.trim();
    if (!url) return;
    if (isDrive) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const fileId = match ? match[1] : url.trim();
      url = `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    setImages((prev) => [...prev, url]);
    setNewUrl("");
    setIsDrive(false);
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateCheckoutImages(product.id, images);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black">
            Imágenes — {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-black text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black/20" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl"
                >
                  <Image
                    src={img}
                    alt={`Image ${i + 1}`}
                    width={60}
                    height={60}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <p className="text-xs text-[#666] truncate flex-1 min-w-0">
                    {img}
                  </p>
                  <button
                    onClick={() => handleRemove(i)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors flex-shrink-0"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <p className="text-sm text-[#999] text-center py-4">
                  Sin imágenes. Agregá al menos una.
                </p>
              )}
            </div>

            {/* Add new image */}
            <div className="flex gap-2 mb-1">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={isDrive ? "https://drive.google.com/file/d/..." : "https://..."}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#333] transition-colors"
              >
                +
              </button>
            </div>
            <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDrive}
                onChange={(e) => setIsDrive(e.target.checked)}
                className="rounded"
              />
              <span className="text-xs text-[#666]">Es Drive</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Guardando..." : "Guardar Imágenes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
