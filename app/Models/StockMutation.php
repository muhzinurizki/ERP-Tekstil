<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMutation extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_type',
        'item_id',
        'from_warehouse',
        'to_warehouse',
        'qty',
        'reference_type',
        'reference_id',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
    ];

    /**
     * Get the warehouse where the stock came from
     */
    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse');
    }

    /**
     * Get the warehouse where the stock goes to
     */
    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse');
    }

    /**
     * Get the raw material if item_type is raw_material
     */
    public function rawMaterial(): BelongsTo
    {
        return $this->belongsTo(RawMaterial::class, 'item_id')
            ->where('item_type', 'raw_material')
            ->with('unitRef');
    }

    /**
     * Get the product if item_type is product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'item_id')
            ->where('item_type', 'product');
    }

    /**
     * Get the user who created this mutation
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope to filter by item
     */
    public function scopeByItem($query, $itemType, $itemId)
    {
        return $query->where('item_type', $item_type)
                    ->where('item_id', $itemId);
    }

    /**
     * Scope to filter by warehouse (either from or to)
     */
    public function scopeByWarehouse($query, $warehouseId)
    {
        return $query->where(function ($q) use ($warehouseId) {
            $q->where('from_warehouse', $warehouseId)
              ->orWhere('to_warehouse', $warehouseId);
        });
    }

    /**
     * Scope for IN mutations (to_warehouse present)
     */
    public function scopeIn($query)
    {
        return $query->whereNotNull('to_warehouse');
    }

    /**
     * Scope for OUT mutations (from_warehouse present)
     */
    public function scopeOut($query)
    {
        return $query->whereNotNull('from_warehouse');
    }
}