"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Llamamos a NextAuth para validar credenciales sin recargar la página
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciales inválidas. Intenta nuevamente.")
      setIsLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    // CONTENEDOR PRINCIPAL: Degradado gris/plata sutil y corporativo
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-300 via-slate-100 to-slate-200 p-4">
      
      {/* TARJETA: border-0 quita cualquier línea blanca fantasma y p-0 elimina rellenos */}
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl bg-white p-0">
        
        {/* CABECERA: rounded-t-2xl fuerza a que la caja oscura tenga la misma curva que la tarjeta exterior */}
        <CardHeader className="bg-slate-950 text-center py-8 px-6 m-0 w-full rounded-t-2xl">
          <CardTitle className="text-3xl font-bold text-white tracking-tight">DevBoard</CardTitle>
          <p className="text-slate-400 text-sm mt-2">Acceso Restringido para Codesarrollo</p>
        </CardHeader>
        
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Correo Corporativo</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empagran.com" 
                required 
                className="w-full h-11 bg-slate-50 border-slate-200 focus-visible:ring-slate-900" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Contraseña</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******" 
                required 
                className="w-full h-11 bg-slate-50 border-slate-200 focus-visible:ring-slate-900" 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md mt-4 text-base font-medium"
            >
              {isLoading ? "Verificando..." : "Ingresar al Sistema"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}