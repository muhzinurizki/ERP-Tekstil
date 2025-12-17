<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'PT Garment Nusantara Abadi',
                'address' => 'Jl. Industri Garmen No. 5, Bandung, Jawa Barat',
                'contact' => '0812-9988-7766',
            ],
            [
                'name' => 'CV Textile Prima Sejahtera',
                'address' => 'Jl. Raya Cimahi No. 120, Cimahi, Jawa Barat',
                'contact' => '0821-4455-6677',
            ],
            [
                'name' => 'PT Busana Modern Indonesia',
                'address' => 'Kawasan Industri MM2100, Bekasi',
                'contact' => '021-8899-3344',
            ],
            [
                'name' => 'UD Konveksi Makmur Jaya',
                'address' => 'Jl. Margomulyo No. 18, Surabaya',
                'contact' => '0857-2233-4455',
            ],
            [
                'name' => 'PT Fashion Global Mandiri',
                'address' => 'Jl. Industri Sandang No. 7, Tangerang',
                'contact' => '0813-7766-5544',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::firstOrCreate(
                ['name' => $customer['name']],
                $customer
            );
        }
    }
}
