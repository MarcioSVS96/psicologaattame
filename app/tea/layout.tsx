import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "TEA (Autismo) | Beatriz Attame - Psicóloga",
  description:
    "Página dedicada ao TEA (Transtorno do Espectro Autista) com informações, temas e orientações iniciais.",
}

export default function TeaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="tea-theme min-h-screen"
      // Base do tema do TEA (escopo só aqui dentro)
      style={
        {
          // cores (você pode trocar depois facilmente)
          ["--tea-bg" as any]: "#F8FAFC",
          ["--tea-surface" as any]: "#FFFFFF",
          ["--tea-text" as any]: "#0F172A",
          ["--tea-muted" as any]: "#475569",
          ["--tea-primary" as any]: "#4F46E5", // indigo
          ["--tea-primary-2" as any]: "#1D4ED8", // azul
          ["--tea-accent" as any]: "#F59E0B", // amber
          ["--tea-border" as any]: "rgba(15, 23, 42, 0.12)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
