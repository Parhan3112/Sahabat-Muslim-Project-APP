import { DZIKIR_PAGI_LIST, DZIKIR_PETANG_LIST, DOA_HARIAN_LIST, DzikirItem } from './dzikir.data.js';

export async function getDzikirByCategory(category: string): Promise<DzikirItem[]> {
  if (category === 'pagi') {
    return DZIKIR_PAGI_LIST;
  }
  if (category === 'petang') {
    return DZIKIR_PETANG_LIST;
  }
  if (category === 'doa-harian') {
    return DOA_HARIAN_LIST;
  }
  return [...DZIKIR_PAGI_LIST, ...DZIKIR_PETANG_LIST, ...DOA_HARIAN_LIST];
}
