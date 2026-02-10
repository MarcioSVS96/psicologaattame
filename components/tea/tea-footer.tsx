import Link from "next/link"

export function TeaFooter() {
  return (
    <footer style={{ background: "#0B1220", color: "#fff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-serif font-bold">
              <span style={{ color: "var(--tea-accent)" }}>TEA</span>{" "}
              <span className="text-white/90">(Autismo)</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Página dedicada a informação e orientação inicial. Conteúdo provisório — vamos evoluir juntos com sua
              linguagem final.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Navegação</h4>
            <nav className="space-y-2 text-sm">
              <a href="#hero" className="block text-white/70 hover:text-white">
                Início
              </a>
              <a href="#services" className="block text-white/70 hover:text-white">
                Serviços
              </a>
              <a href="#subjects" className="block text-white/70 hover:text-white">
                Temas
              </a>
              <a href="#faq" className="block text-white/70 hover:text-white">
                FAQ
              </a>
              <a href="#cta" className="block text-white/70 hover:text-white">
                Contato
              </a>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Voltar</h4>
            <p className="text-white/70 text-sm">
              Quer ver a página principal?
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              Psicoterapia (Home)
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          © 2026 Beatriz Attame. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
