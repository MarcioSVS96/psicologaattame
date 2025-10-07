import { createClient } from "@/lib/supabase/server"
import { ServicesScroller } from "./services-scroller"

export async function ServicesSection() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const { data: services, error } = await supabase // A instância do supabase já foi criada
    .from("services")
    .select("id, title, description, duration_minutes, features, icon") // Removido o 'price'
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error || !services || services.length === 0) {
    // Não renderiza a seção se não houver serviços ou ocorrer um erro
    return null
  }

  // Se houver 3 ou menos serviços, usamos um grid simples. Se houver mais, usamos o scroller.
  const useScroller = services.length > 3
  const containerClasses = useScroller
    ? "" // A classe do scroller será controlada internamente
    : "grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center"

  return (
    <section id="services" className="min-h-screen flex items-center bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-serif font-bold text-navy text-balance">Serviços Oferecidos</h2>
          <p className="text-xl text-gray-600 text-pretty max-w-3xl mx-auto">
            Se você sente que é o momento de olhar para si, agende sua entrevista inicial.
          </p>
        </div>

        {/* Renderiza o scroller apenas se houver mais de 3 serviços */}
        {useScroller ? (
          <ServicesScroller services={services} isLoggedIn={isLoggedIn} />
        ) : (
          <div className={containerClasses}>{/* O código para renderizar o grid simples foi movido para o scroller, mas poderia ser duplicado aqui se necessário */}</div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-gray-600">Atendimento 100% Online!</p>
        </div>
      </div>
    </section>
  )
}
