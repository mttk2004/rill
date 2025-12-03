<?php

namespace App\DataObjects\User;

use App\DataObjects\BaseData;

/**
 * User Data Transfer Object
 *
 * Encapsulates user/customer data.
 */
readonly class UserData extends BaseData
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone = null,
        public ?string $password = null,
        public ?array $address = null,
        public bool $isActive = true,
        public bool $emailVerified = false,
    ) {}

    /**
     * Check if user has complete profile.
     *
     * @return bool
     */
    public function hasCompleteProfile(): bool
    {
        return !empty($this->name)
            && !empty($this->email)
            && !empty($this->phone)
            && !empty($this->address);
    }

    /**
     * Check if email is verified.
     *
     * @return bool
     */
    public function isEmailVerified(): bool
    {
        return $this->emailVerified;
    }

    /**
     * Check if user is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Get user initials for avatar.
     *
     * @return string
     */
    public function getInitials(): string
    {
        $words = explode(' ', $this->name);
        if (count($words) >= 2) {
            return strtoupper(substr($words[0], 0, 1) . substr(end($words), 0, 1));
        }
        return strtoupper(substr($this->name, 0, 2));
    }

    /**
     * Mask phone number for privacy.
     *
     * @return string|null
     */
    public function getMaskedPhone(): ?string
    {
        if (!$this->phone) {
            return null;
        }

        $length = strlen($this->phone);
        if ($length <= 4) {
            return $this->phone;
        }

        return substr($this->phone, 0, 3) . str_repeat('*', $length - 6) . substr($this->phone, -3);
    }

    /**
     * Mask email for privacy.
     *
     * @return string
     */
    public function getMaskedEmail(): string
    {
        $parts = explode('@', $this->email);
        if (count($parts) !== 2) {
            return $this->email;
        }

        $username = $parts[0];
        $domain = $parts[1];

        if (strlen($username) <= 2) {
            return $username . '@' . $domain;
        }

        return substr($username, 0, 2) . str_repeat('*', strlen($username) - 2) . '@' . $domain;
    }
}
