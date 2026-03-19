<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
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
            // checkout page request validation

            // billing information validation
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'mobile' => 'required|string|max:11',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip' => 'required|string|max:6',

            // price
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',

            // frontend cart items validation
            'cart' => 'required|array|min:1',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.title' => 'required|string|max:255',
            'cart.*.size_name' => 'nullable|string|max:100',
            'cart.*.price' => 'required|numeric|min:0',
            'cart.*.qty' => 'required|integer|min:1|max:10',
        ];
    }
}
