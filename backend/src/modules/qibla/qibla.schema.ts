import { z } from 'zod';

export const qiblaQuerySchema = z.object({
  latitude: z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
    message: 'Latitude harus berada antara -90 dan 90',
  }),
  longitude: z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
    message: 'Longitude harus berada antara -180 dan 180',
  }),
});

export type QiblaQuery = z.infer<typeof qiblaQuerySchema>;
