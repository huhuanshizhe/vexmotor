import { getCurrentUserId } from '@/server/auth/session';
import { getAddressesByUser } from '@/server/storefront/account';

import { AddressesClient } from './addresses-client';

export default async function AccountAddressesPage() {
  const userId = await getCurrentUserId();
  const addresses = userId ? await getAddressesByUser(userId) : [];

  return <AddressesClient initialAddresses={addresses} />;
}
