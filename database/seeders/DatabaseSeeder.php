<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
public function run(): void
{
    // Sesuaikan dengan skema tabel users (full_name, username, password, role)
    \App\Models\User::factory()->create([
        'full_name' => 'Administrator',
        'username' => 'admin',
        'password' => bcrypt('password'),
        'role' => 'super_admin',
    ]);

    // Pastikan CustomerSeeder dipanggil di sini juga
    $this->call([
        CustomerSeeder::class,
    ]);
}
}
