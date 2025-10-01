"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.email === "beatriz.attame@gmail.com") {
        setIsAdmin(true)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.email === "beatriz.attame@gmail.com") {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const isHomePage = pathname === "/"

  const navigation = [
    { name: "Início", href: isHomePage ? "#hero" : "/#hero" },
    { name: "Serviços", href: isHomePage ? "#services" : "/#services" },
    { name: "Formação", href: isHomePage ? "#education" : "/#education" },
    { name: "Sobre", href: isHomePage ? "#about" : "/#about" },
    { name: "Contato", href: isHomePage ? "#contact" : "/#contact" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif font-bold text-navy">
              Beatriz Attame
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-navy transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>(11) 99999-9999</span>
            </div>
            {user ? (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>
                    <User className="h-4 w-4 mr-2" />
                    {isAdmin ? "Admin" : "Dashboard"}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-turquoise hover:bg-turquoise/90 text-white">
                  <Link href="/auth/sign-up">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-navy"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-navy transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 border-t mt-2 space-y-2">
                {user ? (
                  <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                    <Link href={isAdmin ? "/admin" : "/dashboard"}>{isAdmin ? "Admin" : "Dashboard"}</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/auth/login">Entrar</Link>
                    </Button>
                    <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                      <Link href="/auth/sign-up">Cadastrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
