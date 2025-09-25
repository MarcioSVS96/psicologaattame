import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, User, Users, Heart, Brain } from "lucide-react"
import Link from "next/link"

export function ServicesSection() {
  const services = [
    {
      icon: User,
      title: "Consulta Individual",
      description:
        "Sessão de terapia individual personalizada para suas necessidades específicas. Trabalho com ansiedade, depressão, autoestima e desenvolvimento pessoal.",
      duration: "60 minutos",
      features: ["Atendimento personalizado", "Técnicas baseadas em evidências", "Ambiente acolhedor"],
    },
    {
      icon: Heart,
      title: "Terapia de Casal",
      description:
        "Sessões focadas em melhorar a comunicação e relacionamento do casal. Trabalho com conflitos, intimidade e fortalecimento dos vínculos.",
      duration: "60 minutos",
      features: ["Melhoria da comunicação", "Resolução de conflitos", "Fortalecimento do relacionamento"],
    },
  ]

  return (
    <section id="services" className="min-h-screen flex items-center bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-serif font-bold text-navy text-balance">Serviços Oferecidos</h2>
          <p className="text-xl text-gray-600 text-pretty max-w-3xl mx-auto">
            Ofereço diferentes modalidades de atendimento psicológico, sempre com foco no acolhimento e na promoção do
            bem-estar emocional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full max-w-[400px]"
            >
              <CardHeader className="text-center pb-4">
                <div className="bg-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-turquoise" />
                </div>
                <CardTitle className="text-xl font-bold text-navy">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-pretty text-sm leading-relaxed">{service.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-turquoise" />
                      <span className="text-gray-600">{service.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-turquoise rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                  <Link href="/book-appointment">Agendar Consulta</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-gray-600">Atendimento 100% Online!</p>
        </div>
      </div>
    </section>
  )
}
