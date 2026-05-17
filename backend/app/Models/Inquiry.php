<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasUuid;

    protected $fillable = [
        'photographer_id', 'type', 'name', 'email', 'phone', 'event_type',
        'event_date', 'location', 'message', 'status', 'source', 'metadata', 'read_at',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'metadata' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(Photographer::class);
    }
}
