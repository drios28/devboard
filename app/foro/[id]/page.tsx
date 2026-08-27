import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// 1. Importamos la sesión de NextAuth
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ForoRequerimiento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const req = await prisma.requerimiento.findUnique({
    where: { id },
    include: { 
      comentarios: { orderBy: { creadoEn: 'asc' }, include: { usuario: true } } 
    }
  })

  if (!req) redirect("/kanban")

  async function cambiarEstado(formData: FormData) {
    "use server"
    const estado = formData.get("estado") as any
    await prisma.requerimiento.update({ where: { id }, data: { estado } })
    
    revalidatePath(`/foro/${id}`)
  }

  async function agregarComentario(formData: FormData) {
    "use server"
    const texto = formData.get("texto") as string
    const codigoSnippet = formData.get("codigoSnippet") as string
    const lenguaje = formData.get("lenguaje") as string
    
    // 2. Obtenemos el usuario real de la sesión
    const session = await getServerSession(authOptions)
    const currentUserId = (session?.user as any)?.id
    if (!currentUserId) throw new Error("No autorizado")
    
    if (texto || codigoSnippet) {
      await prisma.comentario.create({
        data: { 
          texto, 
          codigoSnippet: codigoSnippet || null, 
          lenguaje: lenguaje || null, 
          requerimientoId: id, 
          usuarioId: currentUserId 
        }
      })
    }
    
    revalidatePath(`/foro/${id}`)
  }

  return (
    <main className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{req.titulo}</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">{req.descripcion}</p>
        </div>
        
        <form action={cambiarEstado} className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm w-full md:w-auto">
          <select name="estado" defaultValue={req.estado} className="text-sm border-none bg-transparent outline-none p-2 w-full md:w-auto">
            <option value="SOLICITADO">Solicitado</option>
            <option value="EN_ANALISIS">En Análisis</option>
            <option value="EN_DESARROLLO">En Desarrollo</option>
            <option value="DESPLEGADO">Desplegado</option>
          </select>
          <Button type="submit" size="sm" variant="secondary">Actualizar</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Discusión Técnica</h2>
          
          {req.comentarios.length === 0 ? (
             <p className="text-slate-500 text-sm p-4 border border-dashed rounded-md text-center">No hay comentarios aún. Sé el primero en documentar.</p>
          ) : (
            req.comentarios.map(com => (
              <Card key={com.id} className="shadow-sm">
                <CardHeader className="py-3 bg-slate-100/50 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{com.usuario.nombre}</span>
                    <span className="text-xs text-slate-400">{com.creadoEn.toLocaleDateString("es-ES")}</span>
                  </div>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  {com.texto && <p className="text-slate-700 text-sm whitespace-pre-wrap">{com.texto}</p>}
                  
                  {com.codigoSnippet && (
                    <div className="bg-slate-900 rounded-md overflow-hidden relative shadow-inner">
                      <div className="text-xs text-slate-400 bg-slate-800 px-4 py-1.5 uppercase font-semibold tracking-wider">
                        {com.lenguaje || "CODE"}
                      </div>
                      {/* 3. Lógica dinámica de tamaño de fuente */}
                      <pre className={`p-4 text-green-400 overflow-x-auto font-mono ${
                        com.codigoSnippet.length > 500 ? 'text-[10px] leading-tight' : 
                        com.codigoSnippet.length > 200 ? 'text-xs leading-snug' : 
                        'text-sm leading-relaxed'
                      }`}>
                        <code>{com.codigoSnippet}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">Documentar / Explicar</CardTitle></CardHeader>
            <CardContent>
              <form action={agregarComentario} className="space-y-4">
                <Textarea name="texto" placeholder="Explica a gerencia por qué esto toma tiempo, o detalla el problema..." className="min-h-[100px]"/>
                
                <div className="border rounded-md p-4 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <label className="text-sm font-semibold text-slate-700">Adjuntar Código Fuente (Opcional)</label>
                    <select name="lenguaje" className="text-sm border rounded-md p-1 bg-white">
                      <option value="javascript">JavaScript / TS</option>
                      <option value="sql">SQL</option>
                      <option value="python">Python</option>
                      <option value="html">HTML/CSS</option>
                    </select>
                  </div>
                  <Textarea name="codigoSnippet" placeholder="Pega tu snippet aquí..." className="font-mono text-sm min-h-[150px] bg-slate-900 text-slate-100"/>
                </div>
                <Button type="submit" className="w-full">Publicar en el Foro</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}