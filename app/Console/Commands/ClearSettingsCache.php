<?php

namespace App\Console\Commands;

use App\Services\SettingService;
use Illuminate\Console\Command;

class ClearSettingsCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'settings:clear-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear the settings cache';

    /**
     * Execute the console command.
     */
    public function handle(SettingServiceRefactored $settingService): int
    {
        $settingService->clearCache();

        $this->info('Settings cache cleared successfully!');

        return Command::SUCCESS;
    }
}
