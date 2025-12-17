<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_id',
        'item_type',
        'item_id',
        'qty',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
    ];

    /**
     * Get the warehouse for this stock
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
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
     * Scope to filter by raw material
     */
    public function scopeRawMaterial($query)
    {
        return $query->where('item_type', 'raw_material');
    }

    /**
     * Scope to filter by warehouse
     */
    public function scopeByWarehouse($query, $warehouseId)
    {
        return $query->where('warehouse_id', $warehouseId);
    }

    /**
     * Scope to filter by item
     */
    public function scopeByItem($query, $itemType, $itemId)
    {
        return $query->where('item_type', $itemType)
                    ->where('item_id', $itemId);
    }

    /**
     * Scope to find low stocks (below min_stock)
     */
    public function scopeLowStock($query)
    {
        return $query->whereRaw('qty < (
            SELECT min_stock 
            FROM raw_materials 
            WHERE raw_materials.id = stocks.item_id 
            AND stocks.item_type = "raw_material"
        )');
    }
}