<?php

namespace App\Actions\Notification;

use App\DataObjects\Notification\EmailNotificationData;
use App\Mail\GenericEmail;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Mail;

/**
 * Action to send email notification
 */
class SendEmailAction
{
    /**
     * Send email notification
     */
    public function execute(EmailNotificationData $data, bool $queue = true): ServiceResult
    {
        // Validate data
        $validationErrors = $data->validate();
        if (!empty($validationErrors)) {
            return ServiceResult::error(
                'Invalid email data',
                ['validation_errors' => $validationErrors],
            );
        }

        try {
            $mailable = new GenericEmail(
                subject: $data->subject,
                view: $data->view,
                viewData: $data->data,
            );

            // Add CC and BCC if provided
            if (!empty($data->cc)) {
                $mailable->cc($data->cc);
            }

            if (!empty($data->bcc)) {
                $mailable->bcc($data->bcc);
            }

            // Send email (queued by default if GenericEmail implements ShouldQueue)
            Mail::to($data->to, $data->toName)->send($mailable);

            return ServiceResult::success([
                'to' => $data->to,
                'subject' => $data->subject,
                'queued' => $queue,
            ], 'Email sent successfully');

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Failed to send email: ' . $e->getMessage(),
                [
                    'to' => $data->to,
                    'subject' => $data->subject,
                ],
            );
        }
    }

    /**
     * Send email immediately (bypass queue)
     */
    public function executeNow(EmailNotificationData $data): ServiceResult
    {
        // Validate data
        $validationErrors = $data->validate();
        if (!empty($validationErrors)) {
            return ServiceResult::error(
                'Invalid email data',
                ['validation_errors' => $validationErrors],
            );
        }

        try {
            Mail::to($data->to, $data->toName)->send(
                new GenericEmail(
                    subject: $data->subject,
                    view: $data->view,
                    viewData: $data->data,
                ),
            );

            return ServiceResult::success([
                'to' => $data->to,
                'subject' => $data->subject,
                'queued' => false,
            ], 'Email sent immediately');

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Failed to send email: ' . $e->getMessage(),
                [
                    'to' => $data->to,
                    'subject' => $data->subject,
                ],
            );
        }
    }
}
