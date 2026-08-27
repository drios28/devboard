"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TarjetaForo from "./TarjetaForo"
import { actualizarEstadoRequerimiento } from "@/app/kanban/actions"

const ESTADOS = ["SOLICITADO", "EN_ANALISIS", "EN_DESARROLLO", "DESPLEGADO"] as const

// 1. Agregamos usuarioActualId a los parámetros recibidos
export default function TableroInteractivo({ requerimientos, agregarComentario, usuarioActualId }: any) {
  const [tareas, setTareas] = useState(requerimientos)
  const [isPending, startTransition] = useTransition()

  // Obliga al tablero a actualizarse cuando el servidor envía nuevos comentarios
  useEffect(() => {
    setTareas(requerimientos)
  }, [requerimientos])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("tareaId", id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, nuevoEstado: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("tareaId")
    
    // Actualización optimista (instantánea en pantalla)
    setTareas((prev: any[]) => 
      prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t)
    )

    // Actualizamos la base de datos en segundo plano
    startTransition(() => {
      actualizarEstadoRequerimiento(id, nuevoEstado as any)
    })
  }

  return (
    <div className="flex gap-6 min-w-[1000px] pb-4">
      {ESTADOS.map((estado) => {
        const tareasColumna = tareas.filter((r: any) => r.estado === estado)
        
        return (
          <div 
            key={estado} 
            className="flex-1 min-w-[280px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, estado)}
          >
            <Card className={`bg-slate-100/60 border-dashed h-full min-h-[500px] transition-colors ${isPending ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-700 uppercase">
                  {estado.replace("_", " ")} <Badge variant="secondary">{tareasColumna.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tareasColumna.map((req: any) => (
                  <div 
                    key={req.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, req.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {/* 2. Le pasamos el usuarioActualId a la tarjeta individual */}
                    <TarjetaForo 
                      req={req} 
                      agregarComentario={agregarComentario} 
                      usuarioActualId={usuarioActualId} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}