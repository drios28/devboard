import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando la creación de usuarios...")

  // Encriptamos la contraseña "123456"
  const hashedPassword = await bcrypt.hash('123456', 10)

  // Creamos al usuario jbermudez
  const user1 = await prisma.usuario.upsert({
    where: { email: 'jbermudez@empagran.com' },
    update: {},
    create: {
      email: 'jbermudez@empagran.com',
      nombre: 'J. Bermudez',
      password: hashedPassword,
      rol: 'DEV',
    },
  })

  // Creamos al usuario drios
  const user2 = await prisma.usuario.upsert({
    where: { email: 'drios@empagran.com' },
    update: {},
    create: {
      email: 'drios@empagran.com',
      nombre: 'Daryl Rios',
      password: hashedPassword,
      rol: 'DEV',
    },
  })

  console.log("¡Usuarios creados con éxito!")
  console.log({ jbermudez: user1.email, drios: user2.email })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })