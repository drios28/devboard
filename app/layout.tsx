import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { LayoutDashboard, Kanban, BookText, PlusCircle } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevBoard | PROYECTO FORO-TAREAS PROGRAMACIÓN",
  description: "Plataforma de gestión de requerimientos gerenciales",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50`}>
        
        {/* Barra Lateral (Desktop) */}
        <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shadow-xl z-10">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white tracking-tight">DevBoard</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">v1.0 - Gerencial</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-6">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-all font-medium text-sm">
              <LayoutDashboard size={18} />
              <span>Dashboard Ejecutivo</span>
            </Link>
            <Link href="/kanban" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-all font-medium text-sm">
              <Kanban size={18} />
              <span>Tablero Kanban</span>
            </Link>
            <Link href="/wiki" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-all font-medium text-sm">
              <BookText size={18} />
              <span>Diccionario Wiki</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <Link href="/nuevo" className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-white text-slate-900 px-4 py-2 rounded-md transition-colors font-semibold text-sm shadow-sm">
              <PlusCircle size={18} />
              <span>Nueva Tarea</span>
            </Link>
          </div>
        </aside>

        {/* Contenedor Principal (Donde cargan las páginas) */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Navegación Móvil (Solo visible en celulares) */}
          <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
            <h2 className="font-bold text-lg">DevBoard</h2>
            <div className="flex gap-5">
              <Link href="/"><LayoutDashboard size={22} /></Link>
              <Link href="/kanban"><Kanban size={22} /></Link>
              <Link href="/wiki"><BookText size={22} /></Link>
            </div>
          </header>
          
          {/* Aquí se inyecta el contenido de page.tsx dinámicamente */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </body>
    </html>
  )
}