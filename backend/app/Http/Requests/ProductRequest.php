<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        // product store and update rules
        $productId = $this->route('product')?->id;
        return [
            // validation is here
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:4096',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'qty' => 'nullable|integer|min:0',
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'barcode' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'barcode')->ignore($productId),
            ],
            'status' => 'required|integer|in:0,1',
            'is_featured' => 'required|in:yes,no',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Product title is required',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Product price must be a number.',
            'category_id.required' => 'Product category is required.',
            'category_id.exists' => 'Selected category is invalid.',
            'brand_id.exists' => 'Selected brand is invalid.',

            'sku.required' => 'SKU is required.',
            'sku.unique' => 'This SKU already exists.',

            'barcode.required' => 'Barcode is required.',
            'barcode.unique' => 'This barcode already exists.',

            'status.required' => 'Status is required.',
            'status.in' => 'Status must be 0 or 1.',

            'is_featured.required' => 'Featured field is required.',
            'is_featured.in' => 'Featured value must be yes or no.',
        ];
    }
}
