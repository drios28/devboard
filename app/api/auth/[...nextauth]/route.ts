import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Buscamos al usuario en PostgreSQL
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        // Comparamos la contraseña desencriptándola
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null

        // Devolvemos los datos básicos para la sesión
        return { id: user.id, name: user.nombre, email: user.email }
      }
    })
  ],
  pages: {
    signIn: '/login', // Le decimos al sistema que usaremos nuestra propia pantalla de login
  },
})

export { handler as GET, handler as POST }