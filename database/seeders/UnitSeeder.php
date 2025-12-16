<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['code' => 'KG',   'name' => 'Kilogram'],
            ['code' => 'L',    'name' => 'Liter'],
            ['code' => 'PCS',  'name' => 'Pieces'],
            ['code' => 'M',    'name' => 'Meter'],
            ['code' => 'ROLL', 'name' => 'Roll'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(
                ['code' => $unit['code']],
                $unit
            );
        }
    }
}
