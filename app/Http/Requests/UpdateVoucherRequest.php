<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVoucherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Authorization is handled by VoucherPolicy.
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
        $voucherId = $this->route('id');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vouchers', 'code')->ignore($voucherId),
                'regex:/^[A-Z0-9]+$/',
            ],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:fixed',
            'value' => 'required|numeric|min:0|max:9999999.99',
            'minimum_amount' => 'nullable|numeric|min:0|max:9999999.99',
            'maximum_discount' => 'nullable|numeric|min:0|max:9999999.99',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after:valid_from',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Mã voucher là bắt buộc',
            'code.unique' => 'Mã voucher đã tồn tại',
            'code.regex' => 'Mã voucher chỉ được chứa chữ in hoa và số',
            'name.required' => 'Tên voucher là bắt buộc',
            'type.required' => 'Loại giảm giá là bắt buộc',
            'type.in' => 'Loại giảm giá không hợp lệ',
            'value.required' => 'Giá trị giảm là bắt buộc',
            'value.min' => 'Giá trị giảm phải lớn hơn 0',
            'minimum_amount.min' => 'Đơn hàng tối thiểu phải lớn hơn 0',
            'maximum_discount.min' => 'Giảm tối đa phải lớn hơn 0',
            'usage_limit.min' => 'Giới hạn sử dụng phải lớn hơn 0',
            'usage_limit_per_user.min' => 'Giới hạn sử dụng mỗi người phải lớn hơn 0',
            'valid_from.required' => 'Ngày bắt đầu là bắt buộc',
            'valid_from.date' => 'Ngày bắt đầu không hợp lệ',
            'valid_to.required' => 'Ngày kết thúc là bắt buộc',
            'valid_to.date' => 'Ngày kết thúc không hợp lệ',
            'valid_to.after' => 'Ngày kết thúc phải sau ngày bắt đầu',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert code to uppercase
        if ($this->has('code')) {
            $this->merge([
                'code' => strtoupper($this->code),
            ]);
        }
    }
}
