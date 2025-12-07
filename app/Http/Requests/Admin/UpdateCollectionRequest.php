<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCollectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Route parameter is 'id', not 'collection'
        $collectionId = $this->route('id');
        $collection = \App\Models\Collection::findOrFail($collectionId);
        return $this->user()->can('update', $collection);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $collectionId = $this->route('id');

        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug,' . $collectionId,
            'type' => 'required|in:featured,banner,promotion,curated',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required_with:products|exists:products,id',
            'products.*.position' => 'required_with:products|integer|min:0',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'tên collection',
            'slug' => 'đường dẫn',
            'type' => 'loại collection',
            'description' => 'mô tả',
            'image' => 'hình ảnh',
            'is_active' => 'trạng thái',
            'products' => 'danh sách sản phẩm',
        ];
    }
}
