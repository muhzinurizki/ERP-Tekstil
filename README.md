# ERP Tekstil
## PT. Indotaichen Textile Industry

Sistem Enterprise Resource Planning (ERP) berbasis web untuk industri tekstil, dirancang untuk mengelola proses operasional secara terintegrasi mulai dari:
- Purchasing
- Inventory & Multi Warehouse
- Production
- Sales
- Finance

Aplikasi ini dikembangkan sebagai sistem ERP internal dengan fokus pada:
- Akurasi data
- Keterlacakan proses
- Kontrol operasional

---

## ⚠️ Status Proyek
**Status:** DEVELOPMENT (Dalam Pengembangan Aktif)

Sistem ini masih dalam tahap pengembangan.  
Struktur database, fitur, dan alur bisnis dapat berubah seiring proses implementasi.

**❗ Belum direkomendasikan untuk penggunaan produksi.**

---

## 🎯 Tujuan Pengembangan
- Mensimulasikan sistem ERP industri tekstil secara end-to-end
- Menyediakan platform pembelajaran dan pengembangan sistem informasi
- Menjadi dasar implementasi ERP skala kecil–menengah
- Digunakan sebagai bahan akademik (skripsi / tugas akhir / portofolio)

---

## 🧱 Tech Stack
### Backend
- Laravel
- PHP 8.2+
- MySQL

### Frontend
- Inertia.js (React)
- Tailwind CSS
- Lucide React (Icons)

### Tooling
- Composer
- Node.js & NPM
- Git

---

## 🧩 Modul Sistem (Progress)
| Modul                           | Status          |
|---------------------------------|-----------------|
| Authentication & Login          | ✅ Selesai      |
| UI Layout (Sidebar, Topbar, Dashboard) | ✅ Selesai |
| Database Migration              | ✅ Selesai      |
| User & Role Seeder              | ✅ Selesai      |
| RBAC (Role Based Access Control)| ⏳ Planned      |
| Master Data                     | ⏳ Planned      |
| Purchasing                      | ⏳ Planned      |
| Inventory & Warehouse           | ⏳ Planned      |
| Production                      | ⏳ Planned      |
| Sales                           | ⏳ Planned      |
| Finance                         | ⏳ Planned      |

---

## 👥 Role Pengguna (Awal)
| Role    | Deskripsi                  |
|---------|----------------------------|
| Admin   | Mengelola sistem dan user  |
| Manager | Approval dan monitoring    |
| Staff   | Operasional harian         |

Role ini masih dasar dan akan dikembangkan pada tahap implementasi RBAC.

---

## 🔐 Akun Default (Development)
Setelah menjalankan seeder, akun berikut tersedia:

| Role    | Email                     | Password  |
|---------|---------------------------|-----------|
| Admin   | admin@indotaichen.test    | password  |
| Manager | manager@indotaichen.test  | password  |
| Staff   | staff@indotaichen.test    | password  |

**⚠️ Hanya untuk development. Jangan gunakan password ini di production.**

---

## 📁 Struktur Repository
```
erp-tekstil/
├─ app/                 # Backend logic (Laravel)
├─ database/            # Migration & Seeder
├─ resources/
│   ├─ js/              # React (Inertia)
│   └─ css/             # Tailwind CSS
├─ routes/              # Web routes
├─ public/
├─ docs/                # Dokumentasi (SRS, ERD)
├─ README.md            # Dokumentasi utama
├─ composer.json
├─ package.json
└─ .gitignore
```

---

## 🚀 Cara Menjalankan Project (Development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd erp-tekstil
```

### 2. Install Dependency Backend
```bash
composer install
```

### 3. Install Dependency Frontend
```bash
npm install
```

### 4. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

Atur koneksi database di file `.env`:
```
DB_DATABASE=erp_tekstil
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Migrasi Database & Seeder
```bash
php artisan migrate --seed
```

Jika ingin reset total:
```bash
php artisan migrate:fresh --seed
```

### 6. Jalankan Aplikasi
**Terminal 1**
```bash
php artisan serve
```

**Terminal 2**
```bash
npm run dev
```

### 7. Akses aplikasi melalui browser:
**http://127.0.0.1:8000**

---

## 🧭 Alur Penggunaan Sistem (Saat Ini)
1. User membuka aplikasi
2. Login menggunakan akun yang tersedia
3. Sistem menampilkan:
   - Dashboard
   - Informasi user
   - Navigasi modul (belum aktif semua)
4. Modul lanjutan akan diaktifkan secara bertahap

---

## 🖥️ Dashboard
Dashboard saat ini menampilkan:
- Informasi user yang login
- Role aktif
- Context card (Inventory, Production, Approval)
- Placeholder enterprise untuk KPI & grafik

Dashboard akan dikembangkan setelah data real tersedia.

---

## 🧠 Prinsip Pengembangan
- Modular & bertahap
- Tidak menampilkan data palsu
- UI tenang, profesional, enterprise-grade
- Fokus pada proses bisnis tekstil
- Tidak over-engineering di tahap awal

---

## 📌 Catatan Penting
- File `.env` tidak boleh di-commit
- Password default hanya untuk development
- UI dan database distabilkan sebelum modul inti
- Perubahan besar dicatat per tahap pengembangan

---

## 🛠️ Rencana Tahap Selanjutnya
Tahap berikutnya akan difokuskan pada:
1. RBAC (Hak akses menu & fitur)
2. Master Data (Warehouse, Product, Material)
3. Inventory & Stock Mutation Engine
4. Purchasing (PR → PO → GR)
5. Production Workflow
6. Finance (AP / AR)

---

## 📄 Lisensi
Proyek ini dikembangkan untuk kebutuhan akademik dan simulasi sistem. Belum memiliki lisensi open-source resmi.
