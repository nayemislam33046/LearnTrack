<?php 
// app/Http/Requests/UpdateCourseRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('update', $this->route('course'));
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|min:3|max:100',
            'description' => 'sometimes|string|min:10|max:2000',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}