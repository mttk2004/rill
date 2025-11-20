<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Use Policy created in Task 2
        // $this->route('product') gets the product from {product} in URL
        return $this->user()->can('review', $this->route('product'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:5000'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'existing_images' => ['nullable', 'array', 'max:5'],
            'existing_images.*' => ['string', 'url'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $existingCount = is_array($this->existing_images) ? count($this->existing_images) : 0;
            $newCount = is_array($this->images) ? count($this->images) : 0;

            if ($existingCount + $newCount > 5) {
                $validator->errors()->add('images', 'Tổng số ảnh không được vượt quá 5.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rating.required' => 'Vui lòng chọn số sao đánh giá.',
            'rating.integer' => 'Đánh giá phải là một số nguyên.',
            'rating.min' => 'Đánh giá phải từ 1 đến 5 sao.',
            'rating.max' => 'Đánh giá phải từ 1 đến 5 sao.',
            'comment.required' => 'Vui lòng nhập nhận xét của bạn.',
            'comment.string' => 'Nhận xét phải là một chuỗi văn bản.',
            'comment.min' => 'Nhận xét phải có ít nhất 10 ký tự.',
            'comment.max' => 'Nhận xét không được vượt quá 5000 ký tự.',
            'images.array' => 'Ảnh phải là một mảng.',
            'images.max' => 'Bạn chỉ có thể tải lên tối đa 5 ảnh.',
            'images.*.image' => 'File phải là ảnh.',
            'images.*.mimes' => 'Ảnh phải có định dạng: jpeg, png, jpg, webp.',
            'images.*.max' => 'Kích thước ảnh không được vượt quá 2MB.',
        ];
    }
}
