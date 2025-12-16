<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RawMaterial;
use App\Models\MaterialCategory;

class RawMaterialSeeder extends Seeder
{
    public function run(): void
    {
        $categories = MaterialCategory::all()->keyBy('code');

        $materials = [

            // =======================
            // YARN
            // =======================
            [
                'category' => 'YRN',
                'items' => [
                    ['name' => 'Cotton 20s', 'unit' => 'KG', 'min_stock' => 500],
                    ['name' => 'Cotton 30s', 'unit' => 'KG', 'min_stock' => 400],
                    ['name' => 'Polyester 75D', 'unit' => 'KG', 'min_stock' => 300],
                    ['name' => 'Viscose 30s', 'unit' => 'KG', 'min_stock' => 250],
                ],
            ],

            // =======================
            // CHEMICAL
            // =======================
            [
                'category' => 'CHM',
                'items' => [
                    ['name' => 'Caustic Soda', 'unit' => 'KG', 'min_stock' => 100],
                    ['name' => 'Hydrogen Peroxide', 'unit' => 'KG', 'min_stock' => 80],
                    ['name' => 'Sodium Sulphate', 'unit' => 'KG', 'min_stock' => 120],
                ],
            ],

            // =======================
            // DYE
            // =======================
            [
                'category' => 'DYE',
                'items' => [
                    ['name' => 'Reactive Blue 19', 'unit' => 'KG', 'min_stock' => 50],
                    ['name' => 'Reactive Red 195', 'unit' => 'KG', 'min_stock' => 40],
                    ['name' => 'Disperse Black', 'unit' => 'KG', 'min_stock' => 30],
                ],
            ],

            // =======================
            // AUXILIARY
            // =======================
            [
                'category' => 'AUX',
                'items' => [
                    ['name' => 'Wetting Agent', 'unit' => 'KG', 'min_stock' => 60],
                    ['name' => 'Fixing Agent', 'unit' => 'KG', 'min_stock' => 50],
                    ['name' => 'Softener', 'unit' => 'KG', 'min_stock' => 70],
                ],
            ],
        ];

        foreach ($materials as $group) {
            $category = $categories[$group['category']] ?? null;

            if (!$category) {
                continue;
            }

            foreach ($group['items'] as $item) {
                RawMaterial::firstOrCreate(
                    [
                        'name' => $item['name'],
                        'material_category_id' => $category->id,
                    ],
                    [
                        'unit' => $item['unit'],
                        'min_stock' => $item['min_stock'],
                    ]
                );
            }
        }
    }
}
