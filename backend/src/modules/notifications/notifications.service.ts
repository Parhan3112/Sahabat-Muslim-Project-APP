import { prisma } from '../../config/database.js';
import { UpdateNotificationSettingsInput } from './notifications.schema.js';

export async function getNotificationSettings(userId: string) {
  let settings = await prisma.notificationSetting.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.notificationSetting.create({
      data: {
        userId,
        enableSubuh: true,
        enableDzuhur: true,
        enableAshar: true,
        enableMaghrib: true,
        enableIsya: true,
        enableDailyQuranReminder: true,
        reminderTime: '20:00',
      },
    });
  }

  return settings;
}

export async function updateNotificationSettings(userId: string, input: UpdateNotificationSettingsInput) {
  return prisma.notificationSetting.upsert({
    where: { userId },
    update: {
      ...(input.enableSubuh !== undefined && { enableSubuh: input.enableSubuh }),
      ...(input.enableDzuhur !== undefined && { enableDzuhur: input.enableDzuhur }),
      ...(input.enableAshar !== undefined && { enableAshar: input.enableAshar }),
      ...(input.enableMaghrib !== undefined && { enableMaghrib: input.enableMaghrib }),
      ...(input.enableIsya !== undefined && { enableIsya: input.enableIsya }),
      ...(input.enableDailyQuranReminder !== undefined && { enableDailyQuranReminder: input.enableDailyQuranReminder }),
      ...(input.reminderTime !== undefined && { reminderTime: input.reminderTime }),
    },
    create: {
      userId,
      enableSubuh: input.enableSubuh ?? true,
      enableDzuhur: input.enableDzuhur ?? true,
      enableAshar: input.enableAshar ?? true,
      enableMaghrib: input.enableMaghrib ?? true,
      enableIsya: input.enableIsya ?? true,
      enableDailyQuranReminder: input.enableDailyQuranReminder ?? true,
      reminderTime: input.reminderTime || '20:00',
    },
  });
}
