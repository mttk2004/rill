<?php

namespace App\DataObjects\Notification;

use App\DataObjects\BaseData;
use App\Models\User;

/**
 * DTO for email notification data
 */
readonly class EmailNotificationData extends BaseData
{
    public function __construct(
        public string $to,
        public string $subject,
        public string $view,
        public array $data = [],
        public ?string $toName = null,
        public array $cc = [],
        public array $bcc = [],
    ) {}

    /**
     * Validate email notification data
     */
    public function validate(): array
    {
        $errors = [];

        if (empty($this->to) || !filter_var($this->to, FILTER_VALIDATE_EMAIL)) {
            $errors['to'] = 'Valid email address is required';
        }

        if (empty($this->subject)) {
            $errors['subject'] = 'Email subject is required';
        }

        if (empty($this->view)) {
            $errors['view'] = 'Email view template is required';
        }

        return $errors;
    }

    /**
     * Create from User model
     */
    public static function fromUser(
        User $user,
        string $subject,
        string $view,
        array $data = [],
    ): self {
        return new self(
            to: $user->email,
            subject: $subject,
            view: $view,
            data: array_merge($data, [
                'userName' => $user->name,
                'userEmail' => $user->email,
            ]),
            toName: $user->name,
        );
    }
}
