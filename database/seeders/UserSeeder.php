<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->admin()->create([
            'name' => 'Rill Admin',
            'email' => 'admin@rill.local',
            'phone' => '0901234567',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
        ]);

        // Create additional admin for testing
        User::factory()->admin()->create([
            'name' => 'Admin Manager',
            'email' => 'manager@rill.local',
            'phone' => '0901234568',
            'gender' => 'female',
            'date_of_birth' => '1985-05-15',
        ]);

        // Create sample customers
        User::factory()->customer()->create([
            'name' => 'Nguyễn Văn A',
            'email' => 'customer@rill.local',
            'phone' => '0987654321',
            'gender' => 'male',
            'date_of_birth' => '1995-03-20',
        ]);

        User::factory()->customer()->create([
            'name' => 'Trần Thị B',
            'email' => 'customer2@rill.local',
            'phone' => '0987654322',
            'gender' => 'female',
            'date_of_birth' => '1988-12-10',
        ]);

        // Create random customers for testing
        User::factory()->customer()->count(10)->create();
        
        // Create some unverified customers
        User::factory()->customer()->unverified()->count(3)->create();
    }
}
