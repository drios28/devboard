import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

// Importamos NextAuth para obtener la sesión real
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function NuevaTarea() {
  
  // Función para guardar en la base de datos
  async function crearRequerimiento(formData: FormData) {
    "use server"
    
    // 1. Obtenemos al usuario real logueado en lugar de findFirst()
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    
    if (!userId) throw new Error("No autorizado")

    const titulo = formData.get("titulo") as string
    const descripcion = formData.get("descripcion") as string
    
    // 2. Le enviamos el userId real a Prisma
    await prisma.requerimiento.create({
      data: {
        titulo,
        descripcion,
        estado: "SOLICITADO",
        usuarioId: userId 
      }
    })
    
    // Al guardar, regresamos automáticamente al Kanban
    redirect("/kanban")
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl shadow-lg border-slate-200">
        <CardHeader className="bg-white border-b border-slate-100 pb-6 rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-slate-900">Nuevo Requerimiento</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 bg-white rounded-b-xl">
          <form action={crearRequerimiento} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Título de la Tarea</label>
              <Input name="titulo" placeholder="Ej: Módulo de Reportes" required className="w-full" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Descripción / Requisitos</label>
              <Textarea 
                name="descripcion" 
                placeholder="Explica detalladamente qué se necesita..." 
                required 
                className="min-h-[150px] w-full resize-none" 
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-100">
              <Link href="/kanban">
                <Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                Guardar Tarea
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}