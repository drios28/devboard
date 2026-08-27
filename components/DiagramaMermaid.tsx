"use client"

import React, { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

// Inicializamos Mermaid con un tema limpio y corporativo
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: '#f8fafc',
    primaryBorderColor: '#cbd5e1',
    primaryTextColor: '#0f172a',
    lineColor: '#64748b',
    fontFamily: 'inherit',
  }
})

export default function DiagramaMermaid({ codigo }: { codigo: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        if (codigo && ref.current) {
          // Generamos un ID único para que React no se confunda
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
          const { svg } = await mermaid.render(id, codigo)
          setSvg(svg)
          setError("")
        }
      } catch (err: any) {
        setError("Error de sintaxis en el diagrama. Revisa el código.")
      }
    }
    renderDiagram()
  }, [codigo])

  return (
    <div className="w-full overflow-x-auto bg-white border rounded-md p-4 shadow-sm">
      {error ? (
        <p className="text-red-500 text-sm font-mono">{error}</p>
      ) : (
        <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} className="flex justify-center" />
      )}
    </div>
  )
}