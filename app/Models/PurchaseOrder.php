<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $table = 'purchase_orders';

    protected $fillable = [
        'po_number',
        'po_date',
        'supplier_id',
        'purchase_request_id',
        'created_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'po_date' => 'date',
    ];

    // Generate PO number automatically
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->po_number)) {
                $prefix = 'PO-' . date('Y') . date('m');
                $lastPO = static::where('po_number', 'LIKE', $prefix . '%')
                    ->orderBy('po_number', 'DESC')
                    ->first();
                
                $number = $lastPO ? (int)substr($lastPO->po_number, -5) + 1 : 1;
                $model->po_number = $prefix . '-' . str_pad($number, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    /**
     * Get the supplier for this PO
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the user who created this PO
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the purchase request that this PO is based on (optional)
     */
    public function purchaseRequest(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequest::class, 'purchase_request_id');
    }

    /**
     * Get the items for this PO
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id');
    }
}