import { prisma } from '../../config/database.js';
import { UpdateUserSettingsInput } from './settings.schema.js';

export async function getUserSettings(userId: string) {
  let settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        userId,
        arabicFontSize: 28,
        translationFontSize: 14,
        showTranslation: true,
        showLatin: true,
        audioReciter: 'alafasy',
        theme: 'dark',
      },
    });
  }

  return settings;
}

export async function updateUserSettings(userId: string, input: UpdateUserSettingsInput) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {
      ...(input.arabicFontSize !== undefined && { arabicFontSize: input.arabicFontSize }),
      ...(input.translationFontSize !== undefined && { translationFontSize: input.translationFontSize }),
      ...(input.showTranslation !== undefined && { showTranslation: input.showTranslation }),
      ...(input.showLatin !== undefined && { showLatin: input.showLatin }),
      ...(input.audioReciter !== undefined && { audioReciter: input.audioReciter }),
      ...(input.theme !== undefined && { theme: input.theme }),
    },
    create: {
      userId,
      arabicFontSize: input.arabicFontSize ?? 28,
      translationFontSize: input.translationFontSize ?? 14,
      showTranslation: input.showTranslation ?? true,
      showLatin: input.showLatin ?? true,
      audioReciter: input.audioReciter || 'alafasy',
      theme: input.theme || 'dark',
    },
  });
}
