<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        \App\Models\User::create([
            'name' => 'Admin Test',
            'email' => 'admin@finvisor.local',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // General user
        \App\Models\User::create([
            'name' => 'User Test',
            'email' => 'test@finvisor.local',
            'password' => Hash::make('password123'),
            'role' => 'general',
        ]);
    }
}
