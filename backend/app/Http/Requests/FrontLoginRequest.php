<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FrontLoginRequest extends FormRequest
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
            // validation for frontend login
            'email' => 'required|string|email|max:255|exists:users,email',
            'password' => 'required|min:7',
        ];
    }

    // validation messages
    public function messages(): array
    {
        return [
            'email.required' => 'Email is required.',
            'email.exists' => 'Email does not exist.',
            'password.required' => 'Password is required.',
        ];
    }
}
