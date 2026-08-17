# Sahabat Muslim Backend REST API

Fondasi REST API backend untuk aplikasi **Sahabat Muslim**, dibangun dengan Node.js, Fastify, TypeScript, Prisma ORM, dan PostgreSQL.

---

## 🚀 Fitur Utama Stage 1

- **Framework**: Fastify (cepat & hemat memori)
- **Bahasa**: TypeScript (strict mode & type-safe)
- **Database ORM**: Prisma ORM dengan PostgreSQL
- **Model Dasar**: Model `User` (UUID primary key)
- **Environment Validation**: Zod untuk validasi variabel lingkungan yang aman
- **Centralized Error Handler**: Format error response konsisten
- **API Versioning**: Prefix `/api/v1`
- **Health Check**: `GET /api/v1/health` (dengan pengecekan koneksi database aktif)
- **Automated Tests**: Unit & Integration test menggunakan Vitest dan Fastify `inject()`

---

## 📁 Struktur Folder Project

```text
backend/
├── src/
│   ├── config/          # Konfigurasi env & database
│   ├── plugins/         # Plugin Fastify (CORS, dll)
│   ├── modules/         # Modul fitur (health, auth, users, quran, dll)
│   │   ├── health/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── quran/
│   │   ├── bookmarks/
│   │   ├── reading-progress/
│   │   ├── prayer-times/
│   │   ├── qibla/
│   │   ├── notifications/
│   │   └── settings/
│   ├── middleware/      # Global Error Handling
│   ├── app.ts           # Inisialisasi Fastify app & pendaftaran rute
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Schema database Prisma
├── tests/
│   └── health.test.ts   # Automated API testing
├── .env.example         # Template variabel lingkungan
├── package.json         # Dependensi & script
├── tsconfig.json        # Konfigurasi TypeScript
└── README.md            # Dokumentasi ini
```

---

## ⚙️ Persyaratan Sistem

- **Node.js**: v18+ atau v24+
- **npm**: v9+
- **PostgreSQL**: v14+ / v15+ (berjalan di port 5432)

---

## 🛠️ Langkah Menjalankan Project

### 1. Install Dependensi
```bash
cd backend
npm install
```

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan ganti `DATABASE_URL` sesuai dengan kredensial PostgreSQL Anda:
```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/sahabat_muslim"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

### 3. Generate Prisma Client & Jalankan Migrasi
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Jalankan Server Development
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

---

## 🏥 Testing Endpoint Health

Akses URL berikut di browser / Postman / curl:
```http
GET http://localhost:3000/api/v1/health
```

Contoh response JSON:
```json
{
  "success": true,
  "message": "Sahabat Muslim API is running",
  "database": "connected"
}
```

---

## 🧪 Jalankan Testing dan Typecheck

- **TypeScript Typecheck**:
  ```bash
  npm run typecheck
  ```
- **Automated Tests**:
  ```bash
  npm test
  ```
