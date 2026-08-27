"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Estado } from "@prisma/client"

export async function actualizarEstadoRequerimiento(id: string, nuevoEstado: Estado) {
  await prisma.requerimiento.update({
    where: { id },
    data: { estado: nuevoEstado }
  })
  revalidatePath("/kanban")
}

export async function eliminarComentario(comentarioId: string) {
  await prisma.comentario.delete({
    where: { id: comentarioId }
  })
  revalidatePath("/kanban")
}


// Agrega esta función al final de app/kanban/actions.ts
export async function editarRequerimiento(id: string, titulo: string, descripcion: string) {
  await prisma.requerimiento.update({
    where: { id },
    data: { titulo, descripcion }
  })
  revalidatePath("/kanban")
}


// Agrega esto al final de app/kanban/actions.ts
export async function eliminarRequerimiento(id: string) {
  // 1. Borramos primero los comentarios de esta tarea
  await prisma.comentario.deleteMany({
    where: { requerimientoId: id }
  })
  
  // 2. Borramos la tarea principal
  await prisma.requerimiento.delete({
    where: { id }
  })
  
  revalidatePath("/kanban")
}
