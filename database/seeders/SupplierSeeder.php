<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'PT Sumber Benang Nusantara',
                'address' => 'Jl. Industri Tekstil No. 12, Bandung, Jawa Barat',
                'contact' => '0812-3456-7890',
            ],
            [
                'name' => 'CV Kimia Tekstil Jaya',
                'address' => 'Jl. Raya Cileungsi KM 8, Bogor, Jawa Barat',
                'contact' => '0821-7788-9900',
            ],
            [
                'name' => 'PT Warna Prima Indonesia',
                'address' => 'Kawasan Industri Jababeka, Cikarang',
                'contact' => '021-8899-7766',
            ],
            [
                'name' => 'UD Mesin & Sparepart Tekstil',
                'address' => 'Jl. Gatot Subroto No. 45, Surabaya',
                'contact' => '0856-1122-3344',
            ],
            [
                'name' => 'PT Global Chemical Supply',
                'address' => 'Jl. Industri Kimia No. 3, Tangerang',
                'contact' => '0813-9988-7766',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(
                ['name' => $supplier['name']],
                $supplier
            );
        }
    }
}
