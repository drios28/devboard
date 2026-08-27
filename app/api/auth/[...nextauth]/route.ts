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
        
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) return null 

        let passwordMatch = false;
        if (user.password === credentials.password) {
          passwordMatch = true; 
        } else {
          try {
            passwordMatch = await bcrypt.compare(credentials.password, user.password); 
          } catch (e) {
            passwordMatch = false;
          }
        }

        if (passwordMatch) {
          return { id: user.id, name: user.nombre, email: user.email, rol: (user as any).rol || "Usuario" }
        }
        
        return null 
      }
    })
  ],
  // AÑADIR ESTA LÍNEA AQUÍ:
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
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