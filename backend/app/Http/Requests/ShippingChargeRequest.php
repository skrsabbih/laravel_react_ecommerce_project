<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShippingChargeRequest extends FormRequest
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
            // shipping charge validation
            'shipping_charge' => 'required|numeric',
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_charge.required' => 'Shipping charge is required',
            'shipping_charge.numeric' => 'Shipping charge must be a number',
        ];
    }

    
}
