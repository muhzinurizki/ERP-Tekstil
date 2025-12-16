<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
  protected $fillable = [
    'code',
    'name',
    'is_active',
  ];

  public function rawMaterials()
  {
    return $this->hasMany(RawMaterial::class);
  }
}
