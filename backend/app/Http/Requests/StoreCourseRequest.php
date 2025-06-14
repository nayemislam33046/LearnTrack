<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('create', Course::class);
    }

    public function rules()
    {
        return [
            'title' => 'required|string|min:3|max:100',
            'description' => 'required|string|min:10|max:2000',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ];
    }
}