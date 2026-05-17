<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required_without:files',
                'file',
                'max:102400',
                'mimes:jpeg,jpg,png,webp,heic,heif,tiff,tif,mp4,mov',
            ],
            'files' => ['required_without:file', 'array'],
            'files.*' => [
                'file',
                'max:102400',
                'mimes:jpeg,jpg,png,webp,heic,heif,tiff,tif,mp4,mov',
            ],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required_without' => 'Choose at least one photo or video to upload.',
            'files.required_without' => 'Choose at least one photo or video to upload.',
            'file.max' => 'Each file must be 100 MB or smaller.',
            'files.*.max' => 'Each file must be 100 MB or smaller.',
            'file.mimes' => 'Supported formats: JPEG, PNG, WebP, HEIC, TIFF, MP4, MOV.',
            'files.*.mimes' => 'Supported formats: JPEG, PNG, WebP, HEIC, TIFF, MP4, MOV.',
            'file.uploaded' => 'Upload failed. The file may be too large for the server (max 100 MB per file).',
            'files.*.uploaded' => 'Upload failed. The file may be too large for the server (max 100 MB per file).',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->hasFile('file') || $this->hasFile('files')) {
                return;
            }

            $length = (int) $this->server('CONTENT_LENGTH', 0);
            if ($length <= 0) {
                return;
            }

            $validator->errors()->add(
                'file',
                'Upload failed before it reached the server. Try a smaller file (max 100 MB) or fewer files at once.'
            );
        });
    }
}
