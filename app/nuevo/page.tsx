import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

// Esta función (Server Action) se ejecuta en el servidor cuando envías el formulario
async function crear(formData: FormData) {
  "use server"
  
  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string
  
  // Buscamos un usuario o lo creamos si no existe
  let usuario = await prisma.usuario.findFirst()
  if (!usuario) {
    usuario = await prisma.usuario.create({
      data: { nombre: "Dev", rol: "DEV" }
    })
  }

  // Guardamos la tarea en PostgreSQL
  await prisma.requerimiento.create({
    data: {
      titulo,
      descripcion,
      usuarioId: usuario.id
    }
  })

  // Redirigimos de vuelta al tablero principal
  redirect("/")
}

export default function NuevoRequerimiento() {
  return (
    <main className="p-8 bg-slate-50 min-h-screen flex justify-center items-center">
      <form action={crear} className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Nuevo Requerimiento</h1>
        
        <div className="space-y-2">
          <Label htmlFor="titulo">Título de la Tarea</Label>
          <Input id="titulo" name="titulo" required placeholder="Ej: Módulo de Reportes" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción / Requisitos</Label>
          <Textarea id="descripcion" name="descripcion" required placeholder="Explica detalladamente qué se necesita..." className="min-h-[120px]" />
        </div>

        <div className="flex gap-4 pt-4">
          {/* Corregimos este Link usando buttonVariants */}
          <Link 
            href="/" 
            className={buttonVariants({ variant: "outline", className: "w-full" })}
          >
            Cancelar
          </Link>
          
          <Button type="submit" className="w-full">Guardar Tarea</Button>
        </div>
      </form>
    </main>
  )
}