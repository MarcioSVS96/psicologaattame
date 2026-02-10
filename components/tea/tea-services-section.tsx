import { ClipboardList, Users, Puzzle, MessageCircle } from "lucide-react"

export function TeaServicesSection() {
  const items = [
    {
      icon: ClipboardList,
      title: "Triagem e orientação inicial",
      desc: "Organizamos as principais demandas, histórico e dúvidas para definir próximos passos com clareza.",
    },
    {
      icon: Users,
      title: "Orientação para famílias",
      desc: "Apoio para rotina, comunicação e estratégias práticas no dia a dia (sem excesso de teoria).",
    },
    {
      icon: Puzzle,
      title: "Acompanhamento e manejo comportamental",
      desc: "Estratégias alinhadas à realidade da família, com foco em consistência e previsibilidade.",
    },
    {
      icon: MessageCircle,
      title: "Comunicação e habilidades sociais",
      desc: "Trabalhamos recursos de comunicação e interação com objetivos pequenos e alcançáveis.",
    },
  ]

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-serif font-bold" style={{ color: "var(--tea-text)" }}>
            Serviços (TEA)
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--tea-muted)" }}>
            Conteúdo provisório para iniciar — depois refinamos com a sua abordagem e linguagem final.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl p-6"
              style={{
                background: "var(--tea-surface)",
                border: "1px solid var(--tea-border)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(79,70,229,0.10)" }}
              >
                <it.icon className="h-5 w-5" style={{ color: "var(--tea-primary)" }} />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: "var(--tea-text)" }}>
                {it.title}
              </h3>
              <p className="text-sm mt-2" style={{ color: "var(--tea-muted)" }}>
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
