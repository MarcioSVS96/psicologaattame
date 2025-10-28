"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, User, Users, Heart, Brain, BookOpen, Smile, ClipboardCheck, Briefcase, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  title: string
  description: string
  duration_minutes: number
  features: string[]
  icon: string
}

interface ServicesScrollerProps {
  services: Service[]
  isLoggedIn: boolean
}

const serviceIcons: { [key: string]: React.ElementType } = {
  User, Users, Heart, Brain, BookOpen, Smile, ClipboardCheck, Briefcase, Lightbulb,
}

export function ServicesScroller({ services, isLoggedIn }: ServicesScrollerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth
      setCanScrollLeft(el.scrollLeft > 0)
      setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1) // -1 for precision
    }
  }, [])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (el) {
      checkScrollability()
      window.addEventListener("resize", checkScrollability)
      el.addEventListener("scroll", checkScrollability)
    }
    return () => {
      if (el) {
        window.removeEventListener("resize", checkScrollability)
        el.removeEventListener("scroll", checkScrollability)
      }
    }
  }, [services, checkScrollability])

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current
    if (el) {
      const scrollAmount = el.clientWidth * 0.8 // Scroll by 80% of the container width
      el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full lg:relative">
      <div ref={scrollContainerRef} className="horizontal-scroll-container gap-8 py-5 pl-4 sm:pl-6 lg:pl-8">
        {services.map((service) => {
          const IconComponent = service.icon ? serviceIcons[service.icon] : User
          return (
            <div key={service.id} className="w-[80vw] sm:w-80 flex-shrink-0">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col rounded-lg">
                <CardContent className="p-8 text-center space-y-4 flex flex-col flex-grow">
                  <div className="bg-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <IconComponent className="h-8 w-8 text-turquoise" />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <h3 className="font-bold text-navy text-lg">{service.title}</h3>
                    <p className="text-sm text-gray-600 text-pretty flex-grow">{service.description}</p>
                  </div>
                  <div className="space-y-2 text-left">
                    {Array.isArray(service.features) &&
                      service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-turquoise rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm pt-2">
                    <Clock className="h-4 w-4 text-turquoise" />
                    <span className="text-gray-600">{service.duration_minutes} minutos</span>
                  </div>

                  <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white mt-auto">
                    <Link href={isLoggedIn ? "/book-appointment" : "/auth/login"}>Agendar Consulta</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Botões de Navegação - Visíveis apenas se houver conteúdo para rolar */}
      {(canScrollLeft || canScrollRight) && (
        <div className="mt-4 flex justify-center items-center gap-4 lg:mt-0">
          {/* Botão Esquerdo */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-white/80 hover:bg-white shadow-lg lg:absolute lg:left-2 lg:top-1/2 lg:-translate-y-1/2 z-10 disabled:opacity-0 disabled:cursor-default transition-opacity"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-6 w-6 text-navy" />
          </Button>

        {/* Botão Direito */}
        <Button
          variant="outline"
          size="icon"
            className="rounded-full h-12 w-12 bg-white/80 hover:bg-white shadow-lg lg:absolute lg:right-2 lg:top-1/2 lg:-translate-y-1/2 z-10 disabled:opacity-0 disabled:cursor-default transition-opacity"
          onClick={() => scroll("right")}
            disabled={!canScrollRight}
        >
          <ChevronRight className="h-6 w-6 text-navy" />
        </Button>
        </div>
      )}
    </div>
  )
}