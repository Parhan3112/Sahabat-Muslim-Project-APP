-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "surahNameLatin" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastSurahNumber" INTEGER NOT NULL DEFAULT 1,
    "lastVerseNumber" INTEGER NOT NULL DEFAULT 1,
    "lastSurahNameLatin" TEXT NOT NULL DEFAULT 'Al-Fatihah',
    "totalVersesRead" INTEGER NOT NULL DEFAULT 0,
    "targetKhatamDays" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enableSubuh" BOOLEAN NOT NULL DEFAULT true,
    "enableDzuhur" BOOLEAN NOT NULL DEFAULT true,
    "enableAshar" BOOLEAN NOT NULL DEFAULT true,
    "enableMaghrib" BOOLEAN NOT NULL DEFAULT true,
    "enableIsya" BOOLEAN NOT NULL DEFAULT true,
    "enableDailyQuranReminder" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT NOT NULL DEFAULT '20:00',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "arabicFontSize" INTEGER NOT NULL DEFAULT 28,
    "translationFontSize" INTEGER NOT NULL DEFAULT 14,
    "showTranslation" BOOLEAN NOT NULL DEFAULT true,
    "showLatin" BOOLEAN NOT NULL DEFAULT true,
    "audioReciter" TEXT NOT NULL DEFAULT 'alafasy',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_surahNumber_verseNumber_key" ON "bookmarks"("userId", "surahNumber", "verseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "reading_progress_userId_key" ON "reading_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_userId_key" ON "notification_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
