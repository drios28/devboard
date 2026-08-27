import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Kanban, BookText, Activity } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const nombre = session?.user?.name || "Usuario"

  const totalTareas = await prisma.requerimiento.count()
  const totalModulos = await prisma.moduloAvanzado.count()

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Ejecutivo</h1>
        <p className="text-slate-500 mt-2">Bienvenido de nuevo, <span className="font-semibold text-slate-700">{nombre}</span>. Aquí tienes el resumen de tu proyecto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estado del Sistema</CardTitle>
            <Activity className="text-emerald-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">En Producción</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Desplegado en Railway</p>
          </CardContent>
        </Card>

        <Link href="/kanban" className="block group">
          <Card className="shadow-sm border-slate-200 bg-white group-hover:border-blue-400 group-hover:shadow-md transition-all h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tablero Kanban</CardTitle>
              <Kanban className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalTareas} Tareas</div>
              <p className="text-xs text-slate-500 mt-1">Gestionar requerimientos y foros</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/wiki" className="block group">
          <Card className="shadow-sm border-slate-200 bg-white group-hover:border-violet-400 group-hover:shadow-md transition-all h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Diccionario Wiki</CardTitle>
              <BookText className="text-violet-500 group-hover:scale-110 transition-transform" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalModulos} Módulos</div>
              <p className="text-xs text-slate-500 mt-1">Base de conocimiento técnico</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  )
}