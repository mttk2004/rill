<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $product = $this->route('product');
        return $this->user()->can('update', $product);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $productId = $this->route('product');

        return [
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku,' . $productId,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'nullable|integer|min:0',
            'genre' => 'nullable|string|max:100',
            'label' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,out_of_stock',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:500',
            'artists' => 'nullable|array',
            'artists.*.artist_id' => 'required_with:artists|exists:artists,id',
            'artists.*.role' => 'required_with:artists|in:main,featured,composer,producer',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'tên sản phẩm',
            'sku' => 'mã SKU',
            'price' => 'giá bán',
            'cost_price' => 'giá vốn',
            'stock_quantity' => 'số lượng tồn kho',
            'min_stock_level' => 'mức tồn kho tối thiểu',
            'genre' => 'thể loại',
            'label' => 'nhãn hiệu',
            'status' => 'trạng thái',
            'image' => 'hình ảnh',
        ];
    }
}
