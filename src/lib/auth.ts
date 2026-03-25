// src/lib/auth-options.ts
import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

// In production, configure Google, GitHub, Magic Links etc.
// For now, implementing credentials for MVP, but strongly recommended to switch to passwordless or social.

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Simple Email/Password is tricky with NextAuth + Prisma without extra logic (hashing).
    // Usually CredentialsProvider is used for this, but it bypasses the adapter except for session check.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // TODO: Comparison logic - assuming plain check for now
        // if (!await bcrypt.compare(credentials.password, user.passwordHash)) return null;

        // Mock check for now until bcrypt is added
        const isValid = credentials.password === user.passwordHash;

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", 
  },
};
