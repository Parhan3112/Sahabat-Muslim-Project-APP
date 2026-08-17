import { z } from 'zod';

export const todayPrayerQuerySchema = z.object({
  latitude: z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
    message: 'Latitude harus berada antara -90 dan 90',
  }),
  longitude: z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
    message: 'Longitude harus berada antara -180 dan 180',
  }),
});

export const monthlyPrayerQuerySchema = todayPrayerQuerySchema.extend({
  month: z.string().optional().transform((val) => (val ? parseInt(val, 10) : new Date().getMonth() + 1)),
  year: z.string().optional().transform((val) => (val ? parseInt(val, 10) : new Date().getFullYear())),
});

export type TodayPrayerQuery = z.infer<typeof todayPrayerQuerySchema>;
export type MonthlyPrayerQuery = z.infer<typeof monthlyPrayerQuerySchema>;
