import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

import { compareMd5 } from '@/lib/auth/password';
import { getAuthUserByEmail } from '@/server/auth/customer-auth';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LOCAL_DEV_ADMIN = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'admin@lianchuan.local',
  password: 'Admin123456',
  name: 'Admin User',
};

function getLocalDevAdmin(credentials: z.infer<typeof credentialsSchema>) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (credentials.email !== LOCAL_DEV_ADMIN.email || credentials.password !== LOCAL_DEV_ADMIN.password) {
    return null;
  }

  return {
    id: LOCAL_DEV_ADMIN.id,
    email: LOCAL_DEV_ADMIN.email,
    name: LOCAL_DEV_ADMIN.name,
  };
}

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
        if (!parsed.success) {
          return null;
        }

        const normalizedCredentials = {
          email: parsed.data.email.trim().toLowerCase(),
          password: parsed.data.password,
        };

        const localAdmin = getLocalDevAdmin(normalizedCredentials);
        if (localAdmin) {
          return localAdmin;
        }

        try {
          const user = await getAuthUserByEmail(normalizedCredentials.email);

          if (!user || user.status === 'disabled' || !compareMd5(normalizedCredentials.password, user.passwordHash)) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
          };
        } catch {
          return localAdmin;
        }
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
