"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import DiagramaMermaid from "./DiagramaMermaid"

type Paso = { origen: string; accion: string; destino: string }

export default function EditorForoInteractivo({ requerimientoId, agregarComentario }: { requerimientoId: string, agregarComentario: (formData: FormData) => Promise<void> }) {
  const [texto, setTexto] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Selector principal
  const [tipoAdjunto, setTipoAdjunto] = useState<"ninguno" | "codigo" | "diagrama">("ninguno")
  
  // Estados para Código Regular
  const [lenguajeManual, setLenguajeManual] = useState("typescript")
  const [codigoManualGeneral, setCodigoManualGeneral] = useState("")

  // Estados para el Diagrama
  const [modoDiagrama, setModoDiagrama] = useState<"asistido" | "manual">("asistido")
  const [tipoDiagrama, setTipoDiagrama] = useState<"flujo" | "er">("flujo")
  const [pasos, setPasos] = useState<Paso[]>([{ origen: "", accion: "", destino: "" }])
  const [codigoMermaid, setCodigoMermaid] = useState("")

  useEffect(() => {
    if (modoDiagrama === "asistido" && tipoAdjunto === "diagrama") {
      let code = ""
      if (tipoDiagrama === "flujo") {
        code = "graph TD\n"
        pasos.forEach((p, i) => {
          if (p.origen && p.destino) {
            code += `  Nodo${i}A["${p.origen}"] -->|"${p.accion}"| Nodo${i}B["${p.destino}"]\n`
          }
        })
      } else if (tipoDiagrama === "er") {
        code = "erDiagram\n"
        pasos.forEach((p) => {
          if (p.origen && p.destino) {
            const origenDB = p.origen.replace(/\s+/g, '_').toUpperCase()
            const destinoDB = p.destino.replace(/\s+/g, '_').toUpperCase()
            code += `  ${origenDB} ||--o{ ${destinoDB} : "${p.accion}"\n`
          }
        })
      }
      setCodigoMermaid(code)
    }
  }, [pasos, tipoDiagrama, modoDiagrama, tipoAdjunto])

  const agregarPaso = () => setPasos([...pasos, { origen: "", accion: "", destino: "" }])
  const eliminarPaso = (index: number) => setPasos(pasos.length > 1 ? pasos.filter((_, i) => i !== index) : pasos)
  const actualizarPaso = (index: number, campo: keyof Paso, valor: string) => {
    const nuevosPasos = [...pasos]; nuevosPasos[index][campo] = valor; setPasos(nuevosPasos);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append("texto", texto)
    
    // 👇 SOLUCIÓN: Agregamos el ID del requerimiento al formulario
    formData.append("requerimientoId", requerimientoId)
    
    // Validamos qué adjunto enviar
    if (tipoAdjunto === "diagrama" && codigoMermaid.trim()) {
      formData.append("codigoSnippet", codigoMermaid)
      formData.append("lenguaje", "mermaid")
    } else if (tipoAdjunto === "codigo" && codigoManualGeneral.trim()) {
      formData.append("codigoSnippet", codigoManualGeneral)
      formData.append("lenguaje", lenguajeManual)
    }
    
    await agregarComentario(formData)
    
    // Limpiamos los campos
    setTexto("")
    setPasos([{ origen: "", accion: "", destino: "" }])
    setCodigoMermaid("")
    setCodigoManualGeneral("")
    setTipoAdjunto("ninguno")
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">Aportar a esta tarea</h3>
        <Textarea 
          placeholder="Escribe aquí tu análisis o comentario general..." 
          value={texto} onChange={(e) => setTexto(e.target.value)}
          className="min-h-[100px] border-slate-300 rounded-lg resize-none"
        />
      </div>
      
      {/* SELECTOR DE ADJUNTO TÉCNICO */}
      <div className="bg-slate-100 p-2 rounded-lg flex gap-2">
        <Button type="button" variant={tipoAdjunto === "ninguno" ? "default" : "ghost"} size="sm" onClick={() => setTipoAdjunto("ninguno")}>Solo Texto</Button>
        <Button type="button" variant={tipoAdjunto === "codigo" ? "default" : "ghost"} size="sm" onClick={() => setTipoAdjunto("codigo")}>💻 Añadir Código</Button>
        <Button type="button" variant={tipoAdjunto === "diagrama" ? "default" : "ghost"} size="sm" onClick={() => setTipoAdjunto("diagrama")}>🪄 Añadir Diagrama</Button>
      </div>

      {/* ZONA DE CÓDIGO REGULAR */}
      {tipoAdjunto === "codigo" && (
        <div className="border rounded-xl p-4 bg-slate-50 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Fragmento de Código</span>
            <Input 
              placeholder="Lenguaje (Ej: javascript, sql, python)" 
              value={lenguajeManual} onChange={(e) => setLenguajeManual(e.target.value)} 
              className="w-48 h-8 text-xs" 
            />
          </div>
          <Textarea 
            placeholder="Pega tu código aquí..." 
            value={codigoManualGeneral} onChange={(e) => setCodigoManualGeneral(e.target.value)}
            className="font-mono text-sm min-h-[200px] bg-slate-900 text-green-400 p-4 rounded-lg"
          />
        </div>
      )}

      {/* ZONA DE DIAGRAMA (Constructor Visual + Manual) */}
      {tipoAdjunto === "diagrama" && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
          <div className="flex border-b border-slate-200 bg-slate-100">
            <button type="button" onClick={() => setModoDiagrama("asistido")} className={`flex-1 py-3 text-sm font-medium transition-colors ${modoDiagrama === "asistido" ? "bg-white text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}>Constructor Visual</button>
            <button type="button" onClick={() => setModoDiagrama("manual")} className={`flex-1 py-3 text-sm font-medium transition-colors ${modoDiagrama === "manual" ? "bg-white text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}>Código Mermaid</button>
          </div>

          <div className="p-6">
            {modoDiagrama === "asistido" ? (
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={tipoDiagrama === "flujo"} onChange={() => setTipoDiagrama("flujo")} className="accent-blue-600" />Flujo de Trabajo</label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={tipoDiagrama === "er"} onChange={() => setTipoDiagrama("er")} className="accent-blue-600" />Base de Datos (ER)</label>
                </div>
                
                <div className="space-y-3">
                  {pasos.map((paso, index) => (
                    <div key={index} className="flex gap-3 items-center bg-white p-3 border rounded-lg shadow-sm">
                      {/* FIX: flex-1 permite que los inputs crezcan y no se aplasten */}
                      <Input placeholder="Origen" value={paso.origen} onChange={(e) => actualizarPaso(index, "origen", e.target.value)} className="flex-1 min-w-[120px]" />
                      <span className="text-slate-400 font-bold">→</span>
                      <Input placeholder="Acción (Opcional)" value={paso.accion} onChange={(e) => actualizarPaso(index, "accion", e.target.value)} className="flex-1 min-w-[120px]" />
                      <span className="text-slate-400 font-bold">→</span>
                      <Input placeholder="Destino" value={paso.destino} onChange={(e) => actualizarPaso(index, "destino", e.target.value)} className="flex-1 min-w-[120px]" />
                      <Button type="button" variant="ghost" size="icon" className="text-red-400" onClick={() => eliminarPaso(index)}><Trash2 size={16} /></Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={agregarPaso} className="w-full text-xs border-dashed text-slate-500"><Plus size={14} className="mr-2" /> Agregar conexión</Button>
              </div>
            ) : (
              <Textarea 
                placeholder='Escribe código Mermaid aquí...' 
                value={codigoMermaid} onChange={(e) => setCodigoMermaid(e.target.value)}
                className="font-mono text-sm min-h-[200px] bg-slate-900 text-green-400 p-4 rounded-lg"
              />
            )}

            <div className="mt-6 border-t pt-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Vista Previa del Diagrama</p>
              <div className="bg-white border rounded-xl p-4 min-h-[150px] flex items-center justify-center">
                {codigoMermaid.trim() ? <DiagramaMermaid codigo={codigoMermaid} /> : <span className="text-sm text-slate-400">Generando...</span>}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
        {isSubmitting ? "Publicando..." : "Publicar Aporte"}
      </Button>
    </form>
  )
}