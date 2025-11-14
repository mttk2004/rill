<?php

namespace App\Services;

class ContentValidationService
{
    private array $spamKeywords;
    private array $inappropriateWords;

    public function __construct()
    {
        // Load from config for easy updating
        $this->spamKeywords = config('content.spam_keywords', []);
        $this->inappropriateWords = config('content.inappropriate_words', []);
    }

    /**
     * Check if content is clean (no spam/inappropriate words).
     *
     * @param string $content The content to validate
     * @return bool True if content is clean, false otherwise
     */
    public function isClean(string $content): bool
    {
        $normalized = strtolower(trim($content));

        // Check spam keywords
        foreach ($this->spamKeywords as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return false;
            }
        }

        // Check inappropriate words
        foreach ($this->inappropriateWords as $word) {
            if (str_contains($normalized, $word)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get validation result with details.
     *
     * @param string $content The content to validate
     * @return array{valid: bool, message: string}
     */
    public function validate(string $content): array
    {
        if ($this->isClean($content)) {
            return [
                'valid' => true,
                'message' => 'Nội dung hợp lệ'
            ];
        }

        return [
            'valid' => false,
            'message' => 'Nội dung chứa từ ngữ không phù hợp. Vui lòng kiểm tra lại.'
        ];
    }

    /**
     * Sanitize content by masking inappropriate words.
     *
     * @param string $content The content to sanitize
     * @return string Sanitized content with inappropriate words masked
     */
    public function sanitize(string $content): string
    {
        $sanitized = $content;

        $allBadWords = array_merge($this->spamKeywords, $this->inappropriateWords);

        foreach ($allBadWords as $word) {
            $sanitized = str_ireplace($word, str_repeat('*', strlen($word)), $sanitized);
        }

        return $sanitized;
    }
}
