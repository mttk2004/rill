<?php

namespace App\Services;

class Snowflake
{
    public function id(): string
    {
        // This is a simplified, non-distributed unique ID generator.
        // It's good enough for this development environment.
        $time = floor(microtime(true) * 1000);
        $random = mt_rand(0, 4095); // 12 bits of randomness

        // Combine time and randomness, ensuring it fits within a 64-bit integer space
        // before converting to string.
        $id = ($time << 12) | $random;

        return (string) $id;
    }
}
