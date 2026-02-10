import { ArrowRight } from "lucide-react"

export function TeaCtaSection() {
  return (
    <section id="cta" className="py-20" style={{ background: "rgba(245,158,11,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl p-8 sm:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center"
          style={{ background: "var(--tea-surface)", border: "1px solid var(--tea-border)" }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold" style={{ color: "var(--tea-text)" }}>
              Quer conversar e organizar o próximo passo?
            </h2>
            <p className="text-base" style={{ color: "var(--tea-muted)" }}>
              Me chama no WhatsApp e eu te ajudo a organizar suas dúvidas e entender os próximos passos.
            </p>
          </div>

          <a
            href="https://wa.me/5581985712073"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold"
            style={{ background: "var(--tea-primary)", color: "#fff" }}
          >
            Falar no WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
