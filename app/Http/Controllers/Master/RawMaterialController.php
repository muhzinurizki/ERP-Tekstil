<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\RawMaterial;
use App\Models\MaterialCategory;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RawMaterialController extends Controller
{
    public function index(Request $request)
    {
        $materials = RawMaterial::with(['category', 'unitRef'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('unit', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Master/RawMaterial/Index', [
            'materials' => $materials,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Master/RawMaterial/Create', [
            'categories' => MaterialCategory::where('is_active', true)
                ->select('id', 'code', 'name')
                ->orderBy('name')
                ->get(),
            'units' => Unit::where('is_active', true)
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_category_id' => 'required|exists:material_categories,id',
            'unit_id' => 'required|exists:units,id',
            'name' => 'required|string|max:255',
            'min_stock' => 'required|numeric|min:0',
        ]);

        $unit = Unit::findOrFail($validated['unit_id']);

        RawMaterial::create([
            ...$validated,
            'unit' => $unit->code, // legacy sync
        ]);

        return redirect()
            ->route('raw-materials.index')
            ->with('success', 'Raw material berhasil ditambahkan.');
    }

    public function edit(RawMaterial $rawMaterial)
    {
        return Inertia::render('Master/RawMaterial/Edit', [
            'rawMaterial' => $rawMaterial->load(['category', 'unitRef']),
            'categories' => MaterialCategory::where('is_active', true)
                ->select('id', 'code', 'name')
                ->orderBy('name')
                ->get(),
            'units' => Unit::where('is_active', true)
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function update(Request $request, RawMaterial $rawMaterial)
    {
        $validated = $request->validate([
            'material_category_id' => 'required|exists:material_categories,id',
            'unit_id' => 'required|exists:units,id',
            'name' => 'required|string|max:255',
            'min_stock' => 'required|numeric|min:0',
        ]);

        $unit = Unit::findOrFail($validated['unit_id']);

        $rawMaterial->update([
            ...$validated,
            'unit' => $unit->code, // legacy sync
        ]);

        return redirect()
            ->route('raw-materials.index')
            ->with('success', 'Raw material berhasil diperbarui.');
    }

    public function destroy(RawMaterial $rawMaterial)
    {
        $rawMaterial->delete();

        return redirect()
            ->route('raw-materials.index')
            ->with('success', 'Raw material berhasil dihapus.');
    }
}
