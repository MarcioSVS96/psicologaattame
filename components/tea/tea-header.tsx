"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X} from "lucide-react"

export function TeaHeader() {
  const [open, setOpen] = useState(false)

  const nav = [
    { name: "Início", href: "#hero" },
    { name: "Serviços", href: "#services" },
    { name: "Temas", href: "#subjects" },
    { name: "FAQ", href: "#faq" },
    { name: "Contato", href: "#cta" },
    { name: "Psicoterapia", href: "/" },
  ]

  return (
    <header
      className="fixed top-0 w-full z-50 backdrop-blur-sm border-b"
      style={{
        background: "rgba(248, 250, 252, 0.92)",
        borderColor: "var(--tea-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: Brand + back */}
          <div className="flex items-center gap-3">
            <Link href="/tea" className="font-serif font-bold text-lg sm:text-xl">
              <span style={{ color: "var(--tea-primary)" }}>TEA</span>{" "}
              <span style={{ color: "var(--tea-text)" }}>(Autismo)</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {nav.map((item) =>
            item.href.startsWith("#") ? (
                <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:opacity-80"
                style={{ color: "var(--tea-text)" }}
                >
                {item.name}
                </a>
            ) : (
                <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:opacity-80"
                style={{ color: "var(--tea-text)" }}
                >
                {item.name}
                </Link>
            )
            )}
            <a
              href="https://wa.me/5581985712073"
            onClick={() => setOpen(false)}
            className="mt-2 px-3 py-2 rounded-lg text-sm font-semibold text-center"
            style={{ background: "var(--tea-primary)", color: "#fff" }}
            >
                WhatsApp
            </a>
          </nav>

          {/* Mobile button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            style={{ border: "1px solid var(--tea-border)" }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4">
            <div
              className="rounded-xl p-3"
              style={{
                background: "var(--tea-surface)",
                border: "1px solid var(--tea-border)",
              }}
            >
              <div className="flex flex-col gap-2">
                {nav.map((item) =>
                item.href.startsWith("#") ? (
                    <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80"
                    style={{ color: "var(--tea-text)" }}
                    >
                    {item.name}
                    </a>
                ) : (
                    <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80"
                    style={{ color: "var(--tea-text)" }}
                    >
                    {item.name}
                    </Link>
                )
                )}
                
                <a href="https://wa.me/5581985712073"
                className="text-sm font-semibold px-4 py-2 rounded-lg"
                style={{
                    background: "var(--tea-primary)",
                    color: "#fff",
                }}
                >
                    WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
