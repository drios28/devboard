import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import TableroInteractivo from "@/components/TableroInteractivo"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export default async function KanbanBoard() {
  // 1. OBTENEMOS LA SESIÓN ACTUAL
  const userSession = await getServerSession(authOptions)
  const userId = (userSession?.user as any)?.id

  // 2. INCLUIMOS AL USUARIO CREADOR DE LA TAREA EN LA CONSULTA
  const requerimientos = await prisma.requerimiento.findMany({
    orderBy: { creadoEn: 'desc' },
    include: {
      usuario: true, // <- Esto es clave para saber quién creó la tarea
      comentarios: { orderBy: { creadoEn: 'asc' }, include: { usuario: true } }
    }
  })

  async function agregarComentario(formData: FormData) {
    "use server"
    const texto = formData.get("texto") as string
    const codigoSnippet = formData.get("codigoSnippet") as string
    const lenguaje = formData.get("lenguaje") as string
    const requerimientoId = formData.get("requerimientoId") as string
    
    const session = await getServerSession(authOptions)
    const currentUserId = (session?.user as any)?.id
    if (!currentUserId) throw new Error("No autorizado")
    
    if (texto || codigoSnippet) {
      await prisma.comentario.create({
        data: { texto, codigoSnippet, lenguaje, requerimientoId, usuarioId: currentUserId }
      })
      revalidatePath("/kanban")
    }
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen overflow-x-auto">
      <div className="mb-8 min-w-[800px]">
        <h1 className="text-3xl font-bold text-slate-900">Tablero Kanban</h1>
        <p className="text-slate-500 mt-2">Arrastra y suelta las tareas para cambiar su estado.</p>
      </div>

      <TableroInteractivo 
        requerimientos={requerimientos} 
        agregarComentario={agregarComentario} 
        usuarioActualId={userId} // <- Le pasamos tu ID al tablero
      />
    </main>
  )
}