import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { LayoutDashboard, Kanban, BookText } from "lucide-react"

// 1. Importamos tu Sidebar y las herramientas de sesión
import Sidebar from "@/components/Sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevBoard | PROYECTO FORO-TAREAS PROGRAMACIÓN",
  description: "Plataforma de gestión de requerimientos gerenciales",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 2. Revisamos si el usuario ya hizo login
  const session = await getServerSession(authOptions)

  return (
    <html lang="es">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50`}>
        
        {/* 3. SOLO mostramos el Sidebar de escritorio si hay sesión */}
        {session && (
          <div className="hidden md:flex">
            {/* Le pasamos los datos reales del usuario al Sidebar */}
            <Sidebar usuarioActual={session.user} />
          </div>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* 4. SOLO mostramos el menú móvil si hay sesión */}
          {session && (
            <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
              <h2 className="font-bold text-lg">DevBoard</h2>
              <div className="flex gap-5">
                <Link href="/"><LayoutDashboard size={22} /></Link>
                <Link href="/kanban"><Kanban size={22} /></Link>
                <Link href="/wiki"><BookText size={22} className="text-violet-400 hover:text-violet-300" /></Link>
              </div>
            </header>
          )}
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </body>
    </html>
  )
}