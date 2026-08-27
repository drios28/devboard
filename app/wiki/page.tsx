import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, BookOpen } from "lucide-react"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export default async function WikiPage() {
  const modulos = await prisma.moduloAvanzado.findMany({
    orderBy: { creadoEn: 'desc' },
    include: { usuario: true } 
  })

  // OBTENEMOS EL USUARIO REAL LOGUEADO
  const session = await getServerSession(authOptions)
  const usuarioActualId = (session?.user as any)?.id

  async function crearModulo(formData: FormData) {
    "use server"
    const userSession = await getServerSession(authOptions)
    const userId = (userSession?.user as any)?.id
    
    if (!userId) throw new Error("No autorizado")
    
    await prisma.moduloAvanzado.create({
      data: {
        titulo: formData.get("titulo") as string,
        descripcion: formData.get("descripcion") as string,
        problemaResuelve: formData.get("problemaResuelve") as string,
        sistemasConexos: formData.get("sistemasConexos") as string,
        usuarioId: userId
      }
    })
    revalidatePath("/wiki")
  }

  async function eliminarModulo(formData: FormData) {
    "use server"
    const userSession = await getServerSession(authOptions)
    const userId = (userSession?.user as any)?.id
    if (!userId) throw new Error("No autorizado")

    const id = formData.get("id") as string
    
    const modulo = await prisma.moduloAvanzado.findUnique({ where: { id } })
    if (modulo?.usuarioId === userId) {
      await prisma.moduloAvanzado.delete({ where: { id } })
      revalidatePath("/wiki")
    }
  }

  return (
    <main className="p-8 bg-slate-800 min-h-screen text-slate-200">
      <div className="mb-8 border-b border-slate-700 pb-6 flex items-center gap-4">
        <div className="p-3 bg-violet-900/40 rounded-lg text-violet-300">
          <BookOpen size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Diccionario Arquitectónico</h1>
          <p className="text-slate-400 mt-1">Base de conocimiento técnico.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORMULARIO LATERAL */}
        <div className="lg:col-span-1">
          <Card className="shadow-2xl sticky top-8 bg-slate-700 border-0 overflow-hidden rounded-xl p-0">
            <CardHeader className="bg-slate-800/80 border-b border-slate-600 py-5 px-6 m-0 w-full rounded-t-xl">
              <CardTitle className="text-lg text-white">Nuevo Módulo</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form action={crearModulo} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Título</label>
                  <Input name="titulo" placeholder="Ej: Pasarela de Pagos" required className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-violet-500" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Descripción Técnica</label>
                  <Textarea name="descripcion" placeholder="¿Cómo funciona?" required className="min-h-[100px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-violet-500" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Problema que Resuelve</label>
                  <Textarea name="problemaResuelve" required className="bg-slate-800 border-slate-600 text-white focus-visible:ring-violet-500" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sistemas Conexos</label>
                  <Input name="sistemasConexos" className="bg-slate-800 border-slate-600 text-white focus-visible:ring-violet-500" />
                </div>

                <Button type="submit" className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20">
                  Guardar en la Wiki
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* LISTA DE MÓDULOS */}
        <div className="lg:col-span-2 space-y-6">
          {modulos.length === 0 ? (
            <div className="text-center py-12 bg-slate-700 border border-dashed border-slate-600 rounded-lg text-slate-400">
              El diccionario está vacío.
            </div>
          ) : (
            modulos.map((mod) => (
              <Card key={mod.id} className="shadow-lg border-0 bg-slate-700 overflow-hidden rounded-xl p-0">
                <CardHeader className="border-b border-slate-600 bg-slate-800/50 py-5 px-6 m-0 w-full rounded-t-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white font-bold">{mod.titulo}</CardTitle>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-xs font-normal border-violet-400/30 text-violet-300 bg-violet-500/20">
                          {mod.usuario?.nombre || 'Desconocido'}
                        </Badge>
                        <span className="text-xs text-slate-400">{new Date(mod.creadoEn).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>

                    {usuarioActualId === mod.usuarioId && (
                      <form action={eliminarModulo}>
                        <input type="hidden" name="id" value={mod.id} />
                        <Button type="submit" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors">
                          <Trash2 size={18} />
                        </Button>
                      </form>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Arquitectura</h4>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{mod.descripcion}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800 rounded-lg border border-slate-600">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase">Resolución</h4>
                      <p className="text-sm text-slate-300">{mod.problemaResuelve}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase">Conexiones</h4>
                      <p className="text-sm text-slate-300">{mod.sistemasConexos || 'Ninguno'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}