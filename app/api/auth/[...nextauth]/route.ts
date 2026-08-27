import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // 1. Buscamos al usuario por correo
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) return null // El usuario no existe en Railway

        // 2. Verificamos la contraseña (soporta texto plano o encriptado)
        let passwordMatch = false;
        if (user.password === credentials.password) {
          passwordMatch = true; // Coincidencia exacta (texto plano)
        } else {
          try {
            passwordMatch = await bcrypt.compare(credentials.password, user.password); // Coincidencia encriptada
          } catch (e) {
            passwordMatch = false;
          }
        }

        if (passwordMatch) {
          // Si coincide, enviamos estos datos a la sesión
          return { id: user.id, name: user.nombre, email: user.email, rol: (user as any).rol || "Usuario" }
        }
        
        return null // Contraseña incorrecta
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    // Trasladamos el ID y el ROL del token a la sesión visible
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.rol = token.rol as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST, authOptions }