<?php

namespace App\DataObjects\Review;

use App\DataObjects\BaseData;
use InvalidArgumentException;

/**
 * Review Data DTO
 *
 * Represents review data for create/update operations.
 */
class ReviewData extends BaseData
{
    public function __construct(
        public readonly int $userId,
        public readonly string $productId,
        public readonly int $orderItemId,
        public readonly int $rating,
        public readonly string $comment,
        public readonly ?array $images = null
    ) {
        $this->validate();
    }

    /**
     * Validate review data.
     *
     * @throws InvalidArgumentException
     */
    protected function validate(): void
    {
        if ($this->rating < 1 || $this->rating > 5) {
            throw new InvalidArgumentException('Rating must be between 1 and 5');
        }

        if (empty(trim($this->comment))) {
            throw new InvalidArgumentException('Comment cannot be empty');
        }

        if ($this->images !== null && !is_array($this->images)) {
            throw new InvalidArgumentException('Images must be an array');
        }
    }

    /**
     * Convert to array for database operations.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'product_id' => $this->productId,
            'order_item_id' => $this->orderItemId,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'images' => $this->images,
        ];
    }

    /**
     * Create ReviewData from request data for new review.
     *
     * @param int $userId
     * @param string $productId
     * @param int $orderItemId
     * @param array $data
     * @return self
     */
    public static function fromRequest(int $userId, string $productId, int $orderItemId, array $data): self
    {
        return new self(
            userId: $userId,
            productId: $productId,
            orderItemId: $orderItemId,
            rating: (int) $data['rating'],
            comment: (string) $data['comment'],
            images: $data['images'] ?? null
        );
    }

    /**
     * Create ReviewData for update (no order_item_id needed).
     *
     * @param int $userId
     * @param string $productId
     * @param int $orderItemId
     * @param array $data
     * @return self
     */
    public static function forUpdate(int $userId, string $productId, int $orderItemId, array $data): self
    {
        return new self(
            userId: $userId,
            productId: $productId,
            orderItemId: $orderItemId,
            rating: (int) $data['rating'],
            comment: (string) $data['comment'],
            images: $data['images'] ?? null
        );
    }
}
