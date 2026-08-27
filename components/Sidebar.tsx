"use client" // Convertimos a Client Component para usar funciones de navegador

import Link from "next/link"
import { LayoutDashboard, Kanban, BookText, LogOut, UserCircle, PlusCircle } from "lucide-react"
import { signOut } from "next-auth/react"

export default function Sidebar({ usuarioActual }: { usuarioActual?: { name?: string | null, rol?: string } }) {
  
  // Datos por defecto si no ha cargado la sesión
  const nombre = usuarioActual?.name || "Usuario DevBoard"
  const rol = usuarioActual?.rol || "Administrador"

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shadow-xl z-10">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white tracking-tight">DevBoard</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">v1.0 - Gerencial</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
        <div className="mb-8">
          <Link href="/nuevo" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-md transition-colors font-semibold text-sm shadow-md">
            <PlusCircle size={18} />
            <span>Nueva Tarea</span>
          </Link>
        </div>

        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Gestión</p>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-all font-medium text-sm">
          <LayoutDashboard size={18} /><span>Dashboard Ejecutivo</span>
        </Link>
        <Link href="/kanban" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-all font-medium text-sm">
          <Kanban size={18} /><span>Tablero Kanban</span>
        </Link>

        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Conocimiento</p>
        <Link href="/wiki" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-violet-900/40 hover:text-violet-300 transition-all font-medium text-sm text-violet-400">
          <BookText size={18} /><span>Diccionario Wiki</span>
        </Link>
      </nav>

      {/* --- SECCIÓN DE USUARIO Y LOGOUT ACTIVA --- */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <UserCircle size={32} className="text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none">{nombre}</span>
            <span className="text-xs text-slate-400 mt-1">{rol}</span>
          </div>
        </div>
        
        {/* BOTÓN FUNCIONAL: signOut() destruye la sesión y recarga la app */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-red-900/80 hover:text-red-200 text-slate-300 px-4 py-2 rounded-md transition-colors font-semibold text-sm"
        >
          <LogOut size={16} /><span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}