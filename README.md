# ERP Tekstil – PT. Indotaichen Textile Industry

Sistem ERP Tekstil berbasis web untuk mengelola proses:
- Purchasing
- Inventory & Multi Warehouse
- Production
- Sales
- Finance

Dikembangkan menggunakan:
- Laravel
- Inertia.js (React)
- MySQL
- Tailwind CSS

---

## ⚠️ Status Proyek

**Status: DEVELOPMENT**

Sistem ini masih dalam tahap pengembangan aktif.
Fitur dan struktur dapat berubah seiring proses implementasi.

Belum direkomendasikan untuk penggunaan produksi.

---

## Modul (Progress)

- [x] Authentication & Login
- [x] UI Layout (Sidebar, Topbar, Dashboard)
- [x] Database Migration
- [x] User & Role Seeder
- [ ] RBAC Middleware
- [ ] Master Data
- [ ] Purchasing
- [ ] Inventory
- [ ] Production
- [ ] Sales
- [ ] Finance

---

## Setup Development

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
