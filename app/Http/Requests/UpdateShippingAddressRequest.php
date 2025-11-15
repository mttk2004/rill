<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateShippingAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User can only update their own addresses
        return Auth::check() && $this->route('address')->user_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|required|string|max:255|min:2',
            'phone' => ['sometimes', 'required', 'string', 'max:10', 'regex:/^(03|05|07|08|09)[0-9]{8}$/'],
            'address_line_1' => 'sometimes|required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'province' => 'sometimes|required|string|max:100',
            'province_id' => 'sometimes|required|integer',
            'district' => 'sometimes|required|string|max:100',
            'district_id' => 'sometimes|required|integer',
            'ward' => 'sometimes|required|string|max:100',
            'ward_id' => 'sometimes|required|string|max:20',
            'is_default' => 'sometimes|nullable|boolean',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'Họ tên người nhẫn là bắt buộc.',
            'full_name.min' => 'Họ tên người nhẫn phải có ít nhất 2 ký tự.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.max' => 'Số điện thoại không được vượt quá 10 ký tự.',
            'phone.regex' => 'Số điện thoại không đúng định dạng Việt Nam (03x, 05x, 07x, 08x, 09x).',
            'address_line_1.required' => 'Địa chỉ dòng 1 là bắt buộc.',
            'province.required' => 'Tỉnh/Thành phố là bắt buộc.',
            'district.required' => 'Quận/Huyện là bắt buộc.',
            'ward.required' => 'Phường/Xã là bắt buộc.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure is_default is boolean
        if ($this->has('is_default')) {
            $this->merge([
                'is_default' => filter_var($this->is_default, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }
}
