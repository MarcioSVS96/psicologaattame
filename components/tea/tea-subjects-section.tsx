import { Brain, Ear, CalendarClock, Speech, Home, School } from "lucide-react"

export function TeaSubjectsSection() {
  const topics = [
    { icon: Brain, title: "Sinais e desenvolvimento", desc: "O que costuma chamar atenção e como observar com calma." },
    { icon: Ear, title: "Sensibilidade sensorial", desc: "Som, toque, textura, luz — e ajustes possíveis na rotina." },
    { icon: CalendarClock, title: "Rotina e previsibilidade", desc: "Estratégias simples para diminuir sobrecarga." },
    { icon: Speech, title: "Comunicação", desc: "Pistas, acordos e formas de facilitar a troca no dia a dia." },
    { icon: Home, title: "Família e limites", desc: "Como combinar acolhimento com estrutura (sem culpa)." },
    { icon: School, title: "Escola e adaptação", desc: "Como organizar informação e alinhar expectativas." },
  ]

  return (
    <section id="subjects" className="py-20" style={{ background: "rgba(79,70,229,0.04)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-serif font-bold" style={{ color: "var(--tea-text)" }}>
            Temas principais
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--tea-muted)" }}>
            Esses tópicos guiam a página e ajudam você a entender “por onde começar”.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl p-6"
              style={{ background: "var(--tea-surface)", border: "1px solid var(--tea-border)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(245,158,11,0.14)" }}
                >
                  <t.icon className="h-5 w-5" style={{ color: "var(--tea-accent)" }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: "var(--tea-text)" }}>
                    {t.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "var(--tea-muted)" }}>
                    {t.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
