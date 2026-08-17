import { z } from 'zod';

export const updateUserSettingsSchema = z.object({
  arabicFontSize: z.number().int().min(16).max(60).optional(),
  translationFontSize: z.number().int().min(10).max(30).optional(),
  showTranslation: z.boolean().optional(),
  showLatin: z.boolean().optional(),
  audioReciter: z.string().min(1).optional(),
  theme: z.enum(['dark', 'light', 'green']).optional(),
});

export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;
