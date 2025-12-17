<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequest extends Model
{
    use HasFactory;

    protected $table = 'purchase_requests';

    protected $fillable = [
        'pr_number',
        'request_date',
        'requested_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'request_date' => 'date',
    ];

    // Generate PR number automatically
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->pr_number)) {
                $prefix = 'PR-' . date('Y') . date('m');
                $lastPR = static::where('pr_number', 'LIKE', $prefix . '%')
                    ->orderBy('pr_number', 'DESC')
                    ->first();

                $number = $lastPR ? (int)substr($lastPR->pr_number, -5) + 1 : 1;
                $model->pr_number = $prefix . '-' . str_pad($number, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    /**
     * Get the user who requested this purchase request
     */
    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the items for this purchase request
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseRequestItem::class, 'purchase_request_id');
    }
}
