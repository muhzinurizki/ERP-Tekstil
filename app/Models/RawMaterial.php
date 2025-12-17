<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Support\MaterialCodeGenerator;

class RawMaterial extends Model
{
    protected $fillable = [
        'material_category_id',
        'unit_id',
        'name',
        'unit',        // legacy (akan dihapus nanti)
        'min_stock',
    ];

    public function unitRef()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function category()
    {
        return $this->belongsTo(MaterialCategory::class, 'material_category_id');
    }

    protected static function booted()
    {
        static::creating(function ($material) {
            if (empty($material->code)) {
                $material->code = MaterialCodeGenerator::generate($material->name);
            }
        });
    }
}
