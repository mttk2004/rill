<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some famous artists manually for better data consistency
        $famousArtists = [
            ['name' => 'The Beatles', 'country' => 'United Kingdom', 'description' => 'Legendary British rock band formed in Liverpool in 1960.'],
            ['name' => 'Pink Floyd', 'country' => 'United Kingdom', 'description' => 'Progressive rock band known for philosophical lyrics and elaborate live shows.'],
            ['name' => 'Led Zeppelin', 'country' => 'United Kingdom', 'description' => 'English rock band formed in London in 1968, pioneers of heavy metal and hard rock.'],
            ['name' => 'Queen', 'country' => 'United Kingdom', 'description' => 'British rock band formed in London in 1970, known for theatrical performances.'],
            ['name' => 'Miles Davis', 'country' => 'United States', 'description' => 'American jazz trumpeter, bandleader, and composer, one of the most influential figures in jazz.'],
            ['name' => 'John Coltrane', 'country' => 'United States', 'description' => 'American jazz saxophonist and composer, a major figure in avant-garde jazz.'],
            ['name' => 'Kraftwerk', 'country' => 'Germany', 'description' => 'German electronic music band formed in Düsseldorf in 1970, pioneers of electronic music.'],
            ['name' => 'Daft Punk', 'country' => 'France', 'description' => 'French electronic music duo formed in 1993, known for their robot personas.'],
            ['name' => 'Radiohead', 'country' => 'United Kingdom', 'description' => 'English rock band formed in Abingdon, Oxfordshire, in 1985.'],
            ['name' => 'Nirvana', 'country' => 'United States', 'description' => 'American rock band formed in Aberdeen, Washington, in 1987, leaders of grunge movement.'],
        ];

        foreach ($famousArtists as $artistData) {
            $artistData['slug'] = \Illuminate\Support\Str::slug($artistData['name']);
            $artistData['is_active'] = true; // Ensure famous artists are active
            Artist::factory()->create($artistData);
        }

        // Create some Vietnamese artists
        Artist::factory()->vietnamese()->count(5)->create();

        // Create additional random artists
        Artist::factory()->count(15)->create();

        // Create some inactive artists
        Artist::factory()->inactive()->count(3)->create();
    }
}
