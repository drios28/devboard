import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic";

export default async function WikiModulos() {
  const modulos = await prisma.moduloAvanzado.findMany({
    orderBy: { creadoEn: 'desc' }
  })

  async function crearModulo(formData: FormData) {
    "use server"
    await prisma.moduloAvanzado.create({
      data: {
        titulo: formData.get("titulo") as string,
        descripcion: formData.get("descripcion") as string,
        problemaResuelve: formData.get("problemaResuelve") as string,
        sistemasConexos: formData.get("sistemasConexos") as string,
      }
    })
    revalidatePath("/wiki")
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Diccionario de Módulos</h1>
        <p className="text-slate-500">Documentación de componentes técnicos y lógica de negocio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {modulos.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg border border-dashed">
              <p className="text-slate-500">No hay módulos documentados todavía.</p>
            </div>
          ) : (
            modulos.map(modulo => (
              <Card key={modulo.id} className="shadow-sm">
                <CardHeader className="bg-slate-900 text-white rounded-t-lg pb-4">
                  <CardTitle className="text-xl">{modulo.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm uppercase mb-1">Descripción Técnica</h4>
                    <p className="text-slate-600 text-sm">{modulo.descripcion}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Problema de Negocio que Resuelve</h4>
                    <p className="text-blue-800 text-sm">{modulo.problemaResuelve}</p>
                  </div>
                  {modulo.sistemasConexos && (
                    <div>
                      <h4 className="font-bold text-slate-700 text-sm uppercase mb-1">Sistemas Conexos / Integraciones</h4>
                      <p className="text-slate-600 text-sm font-mono bg-slate-100 p-2 rounded">{modulo.sistemasConexos}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader><CardTitle className="text-lg">Documentar Nuevo Módulo</CardTitle></CardHeader>
            <CardContent>
              <form action={crearModulo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Nombre del Módulo</Label>
                  <Input id="titulo" name="titulo" required placeholder="Ej: Pasarela de Pagos Stripe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">¿Qué hace técnicamente?</Label>
                  <Textarea id="descripcion" name="descripcion" required placeholder="Describe la arquitectura o el flujo..." className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problemaResuelve">¿Qué problema resuelve?</Label>
                  <Textarea id="problemaResuelve" name="problemaResuelve" required placeholder="Ej: Permite facturar automáticamente reduciendo..." className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sistemasConexos">Sistemas Conexos (Opcional)</Label>
                  <Input id="sistemasConexos" name="sistemasConexos" placeholder="Ej: API SRI, Base de Datos Externa" />
                </div>
                <Button type="submit" className="w-full mt-2">Guardar Módulo</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}