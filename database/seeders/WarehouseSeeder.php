<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Warehouse;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = [
            [
                'name' => 'Main Raw Material Warehouse',
                'location' => 'Plant A - Area Gudang Bahan Baku',
            ],
            [
                'name' => 'Auxiliary Material Warehouse',
                'location' => 'Plant A - Gudang Bahan Pendukung',
            ],
            [
                'name' => 'Finished Goods Warehouse',
                'location' => 'Plant A - Area Packing & Ekspedisi',
            ],
            [
                'name' => 'Chemical Warehouse',
                'location' => 'Plant B - Area Bahan Kimia',
            ],
            [
                'name' => 'Spare Part & Maintenance Warehouse',
                'location' => 'Plant B - Area Maintenance',
            ],
            [
                'name' => 'Reject & Rework Warehouse',
                'location' => 'Plant A - Area Quality Control',
            ],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}
