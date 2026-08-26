import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import Link from "next/link"
import GraficoTareas from "@/components/GraficoTareas"

export const dynamic = "force-dynamic";

export default async function DashboardGerencial() {
  const [agrupacionEstados, totalModulos] = await Promise.all([
    prisma.requerimiento.groupBy({
      by: ['estado'],
      _count: { estado: true },
    }),
    prisma.moduloAvanzado.count(),
  ])

  const conteo = {
    SOLICITADO: 0,
    EN_ANALISIS: 0,
    EN_DESARROLLO: 0,
    DESPLEGADO: 0,
  }

  let total = 0
  agrupacionEstados.forEach((item) => {
    conteo[item.estado] = item._count.estado
    total += item._count.estado
  })

  const completados = conteo.DESPLEGADO
  const pendientes = total - completados

  const datosGrafico = [
    { nombre: "Solicitado", cantidad: conteo.SOLICITADO },
    { nombre: "Análisis", cantidad: conteo.EN_ANALISIS },
    { nombre: "Desarrollo", cantidad: conteo.EN_DESARROLLO },
    { nombre: "Desplegado", cantidad: completados },
  ]

  return (
    <main className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Ejecutivo</h1>
        <p className="text-sm sm:text-base text-slate-500">Resumen general de requerimientos y desarrollo</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Total Tareas</CardTitle></CardHeader><CardContent><div className="text-2xl sm:text-3xl font-bold">{total}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Pendientes</CardTitle></CardHeader><CardContent><div className="text-2xl sm:text-3xl font-bold text-amber-600">{pendientes}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Desplegados</CardTitle></CardHeader><CardContent><div className="text-2xl sm:text-3xl font-bold text-green-600">{completados}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Módulos Wiki</CardTitle></CardHeader>
          <CardContent>
            <Link href="/wiki" className="text-2xl sm:text-3xl font-bold text-blue-600 hover:underline">{totalModulos}</Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg sm:text-xl">Flujo de Requerimientos</CardTitle></CardHeader>
        <CardContent><GraficoTareas datos={datosGrafico} /></CardContent>
      </Card>
    </main>
  )
}