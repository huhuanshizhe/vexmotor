import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth/options';

export async function getAuthSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}

export async function getCurrentUserId() {
  try {
    const session = await getAuthSession();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}
