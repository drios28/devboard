"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Check, X } from "lucide-react"
import EditorForoInteractivo from "./EditorForoInteractivos"
import DiagramaMermaid from "./DiagramaMermaid"
import { eliminarComentario, editarRequerimiento, eliminarRequerimiento } from "@/app/kanban/actions"

export default function TarjetaForo({ req, agregarComentario, usuarioActualId }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitulo, setEditTitulo] = useState(req.titulo)
  const [editDescripcion, setEditDescripcion] = useState(req.descripcion)
  const [isSaving, setIsSaving] = useState(false)

  const handleGuardarEdicion = async () => {
    setIsSaving(true)
    await editarRequerimiento(req.id, editTitulo, editDescripcion)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCancelarEdicion = () => {
    setEditTitulo(req.titulo)
    setEditDescripcion(req.descripcion)
    setIsEditing(false)
  }

  return (
    <Dialog>
      {/* VISTA PREVIA DE LA TARJETA EN EL TABLERO */}
      <Card className="shadow-sm hover:border-slate-400 transition-colors cursor-pointer group">
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{req.titulo}</h3>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2">{req.descripcion}</p>
          
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-[10px] font-normal bg-slate-100 text-slate-600">
              {req.usuario?.nombre || 'Usuario Desconocido'}
            </Badge>
            {/* CORRECCIÓN DE FECHA (HYDRATION FIX) */}
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date(req.creadoEn).toLocaleDateString("es-ES")}
            </span>
          </div>
          
          <DialogTrigger className="w-full text-center border border-slate-200 rounded-md py-2 text-xs font-medium bg-white hover:bg-slate-100 cursor-pointer transition-colors text-slate-900 focus:outline-none">
            Abrir Foro y Documentación
          </DialogTrigger>
        </CardContent>
      </Card>

      {/* MODAL DETALLADO CON TODO EL CONTENIDO RESTAURADO */}
      <DialogContent className="w-full sm:max-w-5xl h-[90vh] overflow-y-auto bg-slate-50 p-4 sm:p-8">
        
        <DialogHeader className="mb-6 border-b pb-6">
          {!isEditing ? (
            <div className="flex justify-between items-start pr-6">
              <div>
                <DialogTitle className="text-3xl font-bold text-slate-900">{req.titulo}</DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                    Creado por: {req.usuario?.nombre || 'Usuario Desconocido'}
                  </Badge>
                </div>
                <p className="text-base text-slate-500 mt-4 whitespace-pre-wrap">{req.descripcion}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar Tarea">
                  <Edit2 size={20} />
                </Button>
                
                {usuarioActualId === req.usuarioId && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
                    title="Eliminar Tarea por completo"
                    onClick={async () => {
                      if(confirm("🚨 ¿ESTÁS SEGURO? Se borrará esta tarea y todos sus comentarios y diagramas para siempre.")) {
                        await eliminarRequerimiento(req.id)
                      }
                    }}
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pr-6">
              <Input value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} className="text-2xl font-bold h-12 border-slate-300 focus-visible:ring-blue-600" placeholder="Título de la tarea"/>
              <Textarea value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} className="min-h-[120px] text-base border-slate-300 focus-visible:ring-blue-600" placeholder="Descripción detallada"/>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleCancelarEdicion} disabled={isSaving}><X size={16} className="mr-2" /> Cancelar</Button>
                <Button onClick={handleGuardarEdicion} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white"><Check size={16} className="mr-2" /> {isSaving ? "Guardando..." : "Guardar Cambios"}</Button>
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-8">
          {/* ZONA DE COMENTARIOS Y DIAGRAMAS */}
          {req.comentarios?.length > 0 ? (
            <div className="space-y-6">
              {req.comentarios.map((com: any) => (
                <Card key={com.id} className="shadow-sm border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="flex justify-between items-center bg-slate-100/50 px-6 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-slate-700">{com.usuario?.nombre || 'Desconocido'}</span>
                      {/* CORRECCIÓN DE FECHA (HYDRATION FIX) */}
                      <span className="text-xs text-slate-400 font-mono">{new Date(com.creadoEn).toLocaleDateString("es-ES")}</span>
                    </div>
                    
                    {/* Botón de borrar aporte (Solo si es tu aporte) */}
                    {usuarioActualId === com.usuarioId && (
                      <button 
                        onClick={async () => {
                          if(confirm("¿Seguro que deseas borrar este aporte?")) {
                            await eliminarComentario(com.id)
                          }
                        }}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                        title="Eliminar aporte"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-4">
                    {com.texto && <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{com.texto}</p>}
                    
                    {com.codigoSnippet && com.lenguaje === "mermaid" ? (
                      <div className="mt-4 border rounded-lg overflow-hidden bg-white p-4">
                         <DiagramaMermaid codigo={com.codigoSnippet} />
                      </div>
                    ) : com.codigoSnippet ? (
                      <pre className="p-4 text-sm text-green-400 bg-slate-900 rounded-xl overflow-x-auto font-mono mt-4 shadow-inner">
                        <div className="text-xs text-slate-500 mb-2 uppercase">{com.lenguaje}</div>
                        <code>{com.codigoSnippet}</code>
                      </pre>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed rounded-xl">
              No hay documentación ni debates aún.
            </div>
          )}

          {/* EDITOR INTERACTIVO */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <EditorForoInteractivo requerimientoId={req.id} agregarComentario={agregarComentario} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}