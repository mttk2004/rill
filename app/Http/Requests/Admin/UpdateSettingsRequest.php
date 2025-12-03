<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'settings' => 'required|array',
            'settings.banner_enabled' => 'required|in:0,1',
            'settings.banner_content' => 'required|string|max:500',
            'settings.banner_type' => 'required|in:info,success,warning',
            'settings.shipping_free_threshold' => 'required|numeric|min:0',
            'settings.shipping_estimate_min_days' => 'required|integer|min:1',
            'settings.shipping_estimate_max_days' => 'required|integer|min:1|gte:settings.shipping_estimate_min_days',
            'settings.return_policy_days' => 'required|integer|min:1',
            'settings.return_policy_condition' => 'required|string|max:200',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'settings.banner_enabled.in' => 'Giá trị bật/tắt banner không hợp lệ.',
            'settings.banner_content.required' => 'Nội dung banner không được để trống.',
            'settings.banner_content.max' => 'Nội dung banner không được vượt quá 500 ký tự.',
            'settings.banner_type.in' => 'Kiểu banner phải là info, success hoặc warning.',
            'settings.shipping_free_threshold.required' => 'Giá trị miễn phí vận chuyển không được để trống.',
            'settings.shipping_free_threshold.numeric' => 'Giá trị miễn phí vận chuyển phải là số.',
            'settings.shipping_estimate_max_days.gte' => 'Thời gian giao hàng tối đa phải lớn hơn hoặc bằng thời gian tối thiểu.',
        ];
    }
}
