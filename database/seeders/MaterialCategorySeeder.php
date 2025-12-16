<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaterialCategory;

class MaterialCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['code' => 'YRN', 'name' => 'Yarn'],
            ['code' => 'CHM', 'name' => 'Chemical'],
            ['code' => 'DYE', 'name' => 'Dye'],
            ['code' => 'AUX', 'name' => 'Auxiliary'],
        ];

        foreach ($categories as $category) {
            MaterialCategory::firstOrCreate(
                ['code' => $category['code']],
                $category
            );
        }
    }
}
