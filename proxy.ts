import { NextRequest } from "next/server"
import authMiddleware from "next-auth/middleware"

// Next.js 16+ exige que exportemos una función nombrada o por defecto de forma explícita
export default function proxy(req: NextRequest) {
  // Delegamos la verificación de la sesión a NextAuth
  return (authMiddleware as any)(req)
}

export const config = {
  // Protege todo EXCEPTO la página de login, la API interna y los archivos estáticos
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
}