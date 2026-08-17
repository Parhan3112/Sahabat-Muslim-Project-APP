import { z } from 'zod';

export const updateNotificationSettingsSchema = z.object({
  enableSubuh: z.boolean().optional(),
  enableDzuhur: z.boolean().optional(),
  enableAshar: z.boolean().optional(),
  enableMaghrib: z.boolean().optional(),
  enableIsya: z.boolean().optional(),
  enableDailyQuranReminder: z.boolean().optional(),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam harus HH:mm (contoh: 20:00)').optional(),
});

export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
