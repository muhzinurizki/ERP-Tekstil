<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseRequestItem extends Model
{
    use HasFactory;

    protected $table = 'purchase_request_items';

    protected $fillable = [
        'purchase_request_id',
        'raw_material_id',
        'qty',
        'notes',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
    ];

    public $timestamps = false;

    /**
     * Get the purchase request that owns this item
     */
    public function purchaseRequest(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequest::class, 'purchase_request_id');
    }

    /**
     * Get the raw material for this item
     */
    public function rawMaterial(): BelongsTo
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }
}
