-- CreateTable
CREATE TABLE "EventSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "title" TEXT NOT NULL DEFAULT 'Conférence Annuelle des Traducteurs Chinois',
    "titleEn" TEXT NOT NULL DEFAULT 'Annual Chinese Translators'' Conference',
    "titleZh" TEXT NOT NULL DEFAULT '中文译者年会',
    "eventDate" TEXT NOT NULL DEFAULT 'À confirmer',
    "eventLocation" TEXT NOT NULL DEFAULT 'À confirmer',
    "totalRequired" REAL NOT NULL DEFAULT 25000,
    "year" INTEGER NOT NULL DEFAULT 2025,
    "updatedAt" DATETIME NOT NULL
);
