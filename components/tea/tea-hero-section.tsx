import Link from "next/link"
import { ArrowRight, Sparkles, HeartHandshake, Shield } from "lucide-react"

export function TeaHeroSection() {
  return (
    <section
      id="hero"
      className="pt-16"
      style={{
        background:
          "linear-gradient(135deg, var(--tea-primary) 0%, var(--tea-primary-2) 55%, #0B1220 120%)",
        color: "#fff",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Informação clara, acolhimento e próximos passos sobre{" "}
              <span style={{ color: "var(--tea-accent)" }}>TEA</span>.
            </h1>

            <p className="text-base sm:text-lg text-white/90 max-w-2xl">
              Este espaço é para organizar dúvidas comuns, apresentar temas importantes e facilitar o caminho para uma
              conversa profissional — no seu ritmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <a
                href="https://wa.me/5581985712073"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold"
                style={{ background: "var(--tea-accent)", color: "#111827" }}
                >
                    Falar no WhatsApp
                    <ArrowRight className="h-5 w-5" />
                </a>

              <a
                href="#subjects"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
              >
                Ver temas principais
              </a>
            </div>

            <div className="pt-4 grid sm:grid-cols-3 gap-3">
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}
              >
                <Shield className="h-5 w-5 mb-2" />
                <p className="text-sm font-semibold">Acolhimento</p>
                <p className="text-xs text-white/80">Sem julgamentos, com cuidado.</p>
              </div>

              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}
              >
                <HeartHandshake className="h-5 w-5 mb-2" />
                <p className="text-sm font-semibold">Orientação</p>
                <p className="text-xs text-white/80">Próximos passos com clareza.</p>
              </div>

              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}
              >
                <p className="text-sm font-semibold">CRP 02/28474</p>
                <p className="text-xs text-white/80">Atendimento online.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
