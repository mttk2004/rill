<?php

namespace App\Services;

use App\Actions\Notification\SendEmailAction;
use App\DataObjects\Notification\EmailNotificationData;
use App\Mail\OrderStatusUpdated;
use App\Mail\WelcomeEmail;
use App\Models\Order;
use App\Models\User;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Mail;

/**
 * Refactored notification service with Clean Architecture
 */
class NotificationServiceRefactored
{
    private SendEmailAction $sendEmailAction;

    public function __construct()
    {
        $this->sendEmailAction = new SendEmailAction();
    }

    /**
     * Send welcome email to new user
     */
    public function sendWelcomeEmail(User $user): ServiceResult
    {
        try {
            Mail::to($user)->send(new WelcomeEmail($user));

            return ServiceResult::success([
                'user_id' => $user->id,
                'email' => $user->email,
            ], 'Welcome email sent');

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Failed to send welcome email: ' . $e->getMessage(),
                ['user_id' => $user->id],
            );
        }
    }

    /**
     * Send order status update email
     */
    public function sendOrderStatusEmail(Order $order): ServiceResult
    {
        try {
            Mail::to($order->user->email)->send(new OrderStatusUpdated($order));

            return ServiceResult::success([
                'order_id' => $order->id,
                'email' => $order->user->email,
                'status' => $order->status->value,
            ], 'Order status email sent');

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Failed to send order status email: ' . $e->getMessage(),
                ['order_id' => $order->id],
            );
        }
    }

    /**
     * Send generic email using EmailNotificationData
     */
    public function sendEmail(EmailNotificationData $data, bool $queue = true): ServiceResult
    {
        if ($queue) {
            return $this->sendEmailAction->execute($data);
        }

        return $this->sendEmailAction->executeNow($data);
    }

    /**
     * Send custom email to user
     */
    public function sendCustomEmailToUser(
        User $user,
        string $subject,
        string $view,
        array $data = [],
    ): ServiceResult {
        $emailData = EmailNotificationData::fromUser(
            user: $user,
            subject: $subject,
            view: $view,
            data: $data,
        );

        return $this->sendEmailAction->execute($emailData);
    }

    /**
     * Send email to multiple recipients
     */
    public function sendBulkEmail(
        array $recipients,
        string $subject,
        string $view,
        array $data = [],
    ): ServiceResult {
        $results = [
            'sent' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($recipients as $email) {
            $emailData = new EmailNotificationData(
                to: $email,
                subject: $subject,
                view: $view,
                data: $data,
            );

            $result = $this->sendEmailAction->execute($emailData);

            if ($result->success) {
                $results['sent']++;
            } else {
                $results['failed']++;
                $results['errors'][] = [
                    'email' => $email,
                    'error' => $result->message,
                ];
            }
        }

        if ($results['failed'] === 0) {
            return ServiceResult::success($results, "All {$results['sent']} emails sent successfully");
        }

        return ServiceResult::success(
            $results,
            "{$results['sent']} emails sent, {$results['failed']} failed",
        );
    }
}
