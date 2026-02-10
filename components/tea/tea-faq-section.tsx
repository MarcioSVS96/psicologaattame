export function TeaFaqSection() {
  const faqs = [
    {
      q: "Essa página substitui avaliação/diagnóstico?",
      a: "Não. Ela serve como orientação inicial e organização de dúvidas. Avaliação e diagnóstico seguem critérios e profissional habilitado.",
    },
    {
      q: "Por onde começar se estou perdido(a)?",
      a: "Comece pelo que é mais urgente no dia a dia (rotina, crises, comunicação) e leve essas observações para uma conversa profissional.",
    },
    {
      q: "Atendimento é online?",
      a: "Sim, 100% online. Isso facilita acompanhamento e rotina da família.",
    },
    {
      q: "O que devo levar para o primeiro contato?",
      a: "Uma descrição simples: o que preocupa, há quanto tempo, como é a rotina, escola, alimentação/sono, e exemplos reais do que acontece.",
    },
  ]

  return (
    <section id="faq" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-4xl font-serif font-bold" style={{ color: "var(--tea-text)" }}>
            Perguntas frequentes
          </h2>
          <p className="text-lg" style={{ color: "var(--tea-muted)" }}>
            Respostas diretas para o que mais aparece no início.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl p-5"
              style={{ background: "var(--tea-surface)", border: "1px solid var(--tea-border)" }}
            >
              <summary className="cursor-pointer font-semibold" style={{ color: "var(--tea-text)" }}>
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--tea-muted)" }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
