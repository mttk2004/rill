<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Product;
use App\Models\Artist;
use App\Models\User;

class MigrateImagesToSupabase extends Command
{
    protected $signature = 'images:migrate-to-supabase
                            {--type=all : Type to migrate (products|artists|avatars|all)}
                            {--dry-run : Preview migration without actually uploading}';

    protected $description = 'Migrate images from local storage to Supabase';

    public function handle()
    {
        $type = $this->option('type');
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('🔍 DRY RUN MODE - No files will be uploaded');
        }

        $this->info('🚀 Starting migration to Supabase...');
        $this->newLine();

        match($type) {
            'products' => $this->migrateProducts($dryRun),
            'artists' => $this->migrateArtists($dryRun),
            'avatars' => $this->migrateAvatars($dryRun),
            'all' => $this->migrateAll($dryRun),
            default => $this->error("Invalid type: {$type}")
        };

        $this->newLine();
        $this->info('✅ Migration completed!');
    }

    private function migrateAll($dryRun)
    {
        $this->migrateProducts($dryRun);
        $this->newLine();
        $this->migrateArtists($dryRun);
        $this->newLine();
        $this->migrateAvatars($dryRun);
    }

    private function migrateProducts($dryRun)
    {
        $this->info('📦 Migrating Product Images...');

        $products = Product::whereNotNull('image')
            ->where('image', 'not like', 'http%')
            ->where('image', 'like', '/images/%')
            ->get();

        if ($products->isEmpty()) {
            $this->warn('No products to migrate.');
            return;
        }

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($products as $product) {
            try {
                $oldPath = public_path($product->image);

                if (!File::exists($oldPath)) {
                    $failed++;
                    $bar->advance();
                    continue;
                }

                $filename = basename($oldPath);
                $newPath = "products/{$filename}";

                if (!$dryRun) {
                    $fileContent = File::get($oldPath);
                    Storage::disk('supabase')->put($newPath, $fileContent);
                    $product->update(['image' => $newPath]);
                }

                $success++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed: {$product->name} - {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("✓ Success: {$success} | ✗ Failed: {$failed}");
    }

    private function migrateArtists($dryRun)
    {
        $this->info('🎤 Migrating Artist Images...');

        $artists = Artist::whereNotNull('image')
            ->where('image', 'not like', 'http%')
            ->get();

        if ($artists->isEmpty()) {
            $this->warn('No artists to migrate.');
            return;
        }

        $bar = $this->output->createProgressBar($artists->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($artists as $artist) {
            try {
                // Artist images are in storage/app/public/artists
                $oldPath = storage_path('app/public/' . $artist->image);

                if (!File::exists($oldPath)) {
                    $failed++;
                    $bar->advance();
                    continue;
                }

                $filename = basename($oldPath);
                $newPath = "artists/{$filename}";

                if (!$dryRun) {
                    $fileContent = File::get($oldPath);
                    Storage::disk('supabase')->put($newPath, $fileContent);
                    $artist->update(['image' => $newPath]);
                }

                $success++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed: {$artist->name} - {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("✓ Success: {$success} | ✗ Failed: {$failed}");
    }

    private function migrateAvatars($dryRun)
    {
        $this->info('👤 Migrating User Avatars...');

        $users = User::whereNotNull('avatar')
            ->where('avatar', 'not like', 'http%')
            ->get();

        if ($users->isEmpty()) {
            $this->warn('No user avatars to migrate.');
            return;
        }

        $bar = $this->output->createProgressBar($users->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                $oldPath = storage_path('app/public/' . $user->avatar);

                if (!File::exists($oldPath)) {
                    $failed++;
                    $bar->advance();
                    continue;
                }

                $filename = basename($oldPath);
                $newPath = "avatars/{$filename}";

                if (!$dryRun) {
                    $fileContent = File::get($oldPath);
                    Storage::disk('supabase')->put($newPath, $fileContent);
                    $user->update(['avatar' => $newPath]);
                }

                $success++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed: {$user->name} - {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("✓ Success: {$success} | ✗ Failed: {$failed}");
    }
}
