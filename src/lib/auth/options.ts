import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

import { compareMd5 } from '@/lib/auth/password';
import { sql } from '@/lib/db';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success || !sql) {
          return null;
        }

        const [user] = await sql<UserRow[]>`
          select id, email, password_hash, first_name, last_name, role
          from users
          where email = ${parsed.data.email}
          limit 1
        `;

        if (!user || !compareMd5(parsed.data.password, user.password_hash)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id;
      }
      return session;
    },
  },
};
