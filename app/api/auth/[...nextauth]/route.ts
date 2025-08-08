import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { supabaseService } from "@/lib/supabase-server"

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null
      const supabase = supabaseService()

      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, name, role")
        .eq("email", credentials.email)
        .maybeSingle()
      if (error || !user) return null

      const { data: cred, error: cErr } = await supabase
        .from("credentials")
        .select("password_hash")
        .eq("user_id", user.id)
        .maybeSingle()
      if (cErr || !cred) return null

      const ok = await bcrypt.compare(credentials.password, cred.password_hash)
      if (!ok) return null

      return { id: user.id, email: user.email, name: user.name, role: user.role }
    },
  }),
] as any[]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  )
}

export const authOptions = {
  providers,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // When signing in via OAuth, ensure user exists
      const supabase = supabaseService()
      if (account && (user as any)?.email) {
        const email = (user as any).email as string
        const name = (user as any).name as string | null
        // Upsert users table
        await supabase.from("users").upsert(
          {
            email,
            name: name ?? "",
          },
          { onConflict: "email" }
        )
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, role, name")
          .eq("email", email)
          .single()
        if (dbUser) {
          token.userId = dbUser.id
          token.role = dbUser.role
          token.name = dbUser.name
          token.email = email
        }
      }
      if (user) {
        // credentials path
        token.userId = (user as any).id
        token.role = (user as any).role ?? "user"
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        ;(session.user as any).id = (token as any).userId
        ;(session.user as any).role = (token as any).role ?? "user"
      }
      return session
    },
  },
  // Important: do not set Edge runtime here; NextAuth needs Node runtime.
} satisfies NextAuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
