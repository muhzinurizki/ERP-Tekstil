<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * Pastikan role sudah ada
         * (jika belum, buat di sini agar seeder idempotent)
         */
        $roles = [
            'admin',
            'manager',
            'staff',
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        $adminRoleId   = DB::table('roles')->where('name', 'admin')->value('id');
        $managerRoleId = DB::table('roles')->where('name', 'manager')->value('id');
        $staffRoleId   = DB::table('roles')->where('name', 'staff')->value('id');

        /**
         * ADMIN
         */
        $admin = User::updateOrCreate(
            ['email' => 'admin@indotaichen.test'],
            [
                'name'     => 'System Admin',
                'password' => Hash::make('password'),
            ]
        );

        DB::table('role_user')->updateOrInsert(
            [
                'user_id' => $admin->id,
                'role_id' => $adminRoleId,
            ]
        );

        /**
         * MANAGER
         */
        $manager = User::updateOrCreate(
            ['email' => 'manager@indotaichen.test'],
            [
                'name'     => 'Production Manager',
                'password' => Hash::make('password'),
            ]
        );

        DB::table('role_user')->updateOrInsert(
            [
                'user_id' => $manager->id,
                'role_id' => $managerRoleId,
            ]
        );

        /**
         * STAFF
         */
        $staff = User::updateOrCreate(
            ['email' => 'staff@indotaichen.test'],
            [
                'name'     => 'Staff Operasional',
                'password' => Hash::make('password'),
            ]
        );

        DB::table('role_user')->updateOrInsert(
            [
                'user_id' => $staff->id,
                'role_id' => $staffRoleId,
            ]
        );
    }
}
