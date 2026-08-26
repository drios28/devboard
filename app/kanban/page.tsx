import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default async function KanbanBoard() {
  const requerimientos = await prisma.requerimiento.findMany({
    orderBy: { creadoEn: 'desc' }
  })

  const columnas = {
    SOLICITADO: requerimientos.filter(r => r.estado === "SOLICITADO"),
    EN_ANALISIS: requerimientos.filter(r => r.estado === "EN_ANALISIS"),
    EN_DESARROLLO: requerimientos.filter(r => r.estado === "EN_DESARROLLO"),
    DESPLEGADO: requerimientos.filter(r => r.estado === "DESPLEGADO"),
  }

  const titulos = {
    SOLICITADO: "Solicitado",
    EN_ANALISIS: "En Análisis",
    EN_DESARROLLO: "En Desarrollo",
    DESPLEGADO: "Desplegado"
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen overflow-x-auto">
      <div className="mb-8 min-w-[800px]">
        <h1 className="text-3xl font-bold text-slate-900">Tablero Kanban</h1>
        <p className="text-slate-500">Flujo de trabajo de los requerimientos</p>
      </div>

      <div className="flex gap-6 min-w-[1000px] pb-4">
        {Object.entries(columnas).map(([estado, tareas]) => (
          <div key={estado} className="flex-1 min-w-[280px]">
            <Card className="bg-slate-100/60 border-dashed h-full min-h-[500px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-700 flex justify-between items-center uppercase tracking-wider">
                  {titulos[estado as keyof typeof titulos]}
                  <Badge variant="secondary">{tareas.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tareas.length === 0 && <p className="text-xs text-slate-400 text-center py-6 font-medium">Sin tareas</p>}
                {tareas.map((req) => (
                  <Card key={req.id} className="shadow-sm hover:border-slate-400 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-1">{req.titulo}</h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{req.descripcion}</p>
                      <Link href={`/foro/${req.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full text-xs" })}>
                        Ver Foro y Código
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </main>
  )
}