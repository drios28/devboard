"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Ejecutamos el login con NextAuth
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciales inválidas. Intenta nuevamente.")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 bg-slate-900 text-white rounded-t-xl pb-6">
          <CardTitle className="text-2xl font-bold text-center">DevBoard</CardTitle>
          <p className="text-center text-slate-400 text-sm font-mono">Acceso Restringido para Codesarrollo</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 border border-red-200 p-2 rounded">{error}</p>}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Corporativo</Label>
              <Input 
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="drios@empresa.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
              />
            </div>
            
            <Button type="submit" className="w-full mt-4">Ingresar al Sistema</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}