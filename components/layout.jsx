"use client"; // assure que c'est un Client Component

import { useState, useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // empêche le rendu côté serveur

  return (
    <div>
      {/* Sidebar fixe desktop */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-base-200 z-40 hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar mobile (drawer) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-screen w-64 bg-base-200 z-50 mt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Header fixe */}
      <div className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-12rem)] h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between ">
        <Header />
        {/* Bouton toggle mobile */}
        <button
          className="md:hidden btn btn-ghost btnOpenSidebar"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Contenu principal */}
      <main className="pt-16 p-4 bg-base-100 min-h-screen md:ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
}
