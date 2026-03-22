"use client";

import { useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import AdminOverlay, { AddProductModal } from "@/components/AdminOverlay";

function HomeContent() {
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <AdminOverlay
        onRefresh={() => {}}
        onAuthChange={setAdminAuthed}
      />
      <Navbar transparent />

      {/* Full-screen hero video */}
      <section className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
        />
        {/* Subtle dark overlay for readability */}
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* Admin add product modal (kept for admin functionality) */}
      {showAddForm && (
        <AddProductModal
          onClose={() => setShowAddForm(false)}
          onCreated={() => setShowAddForm(false)}
        />
      )}

    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
