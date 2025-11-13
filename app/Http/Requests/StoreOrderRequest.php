<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shipping_address_id' => [
                'required',
                'string',
                'exists:shipping_addresses,id,user_id,' . Auth::id(),
            ],
            'payment_method' => ['required', 'string', 'in:' . PaymentMethod::COD->value . ',' . PaymentMethod::VNPAY->value],
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_address_id.required' => 'Vui lòng chọn một địa chỉ giao hàng.',
            'shipping_address_id.exists' => 'Địa chỉ giao hàng không hợp lệ.',
            'payment_method.required' => 'Vui lòng chọn phương thức thanh toán.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
        ];
    }
}
