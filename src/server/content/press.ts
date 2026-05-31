import 'server-only';

import { mediaKitContents, pressBoilerplate, pressReleases, type PressRelease } from '@/lib/press';

export type PressCatalog = {
  sourceMode: 'code-seeded' | 'admin-managed';
  boilerplate: string;
  mediaKitContents: string[];
  releases: PressRelease[];
};

export async function getPressCatalog(): Promise<PressCatalog> {
  return {
    sourceMode: 'code-seeded',
    boilerplate: pressBoilerplate,
    mediaKitContents: [...mediaKitContents],
    releases: [...pressReleases],
  };
}