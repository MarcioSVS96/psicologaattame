// c:\Projetos\psicologaattame\app\admin\blog\page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PlusCircle, Edit } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function AdminBlogPage() {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, author_name, created_at, status")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar posts:", error)
    // Lidar com o erro de forma apropriada
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy">Gerenciar Blog</h1>
          <p className="text-gray-600 mt-1">Crie, edite e publique os artigos do seu blog.</p>
        </div>
        <Button asChild className="bg-turquoise hover:bg-turquoise/90 text-white">
          <Link href="/admin/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(post.status)}>{post.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(post.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/blog/${post.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum post encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
