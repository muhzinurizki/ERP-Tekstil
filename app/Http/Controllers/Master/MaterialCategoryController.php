<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\MaterialCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = MaterialCategory::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Master/MaterialCategory/Index', [
            'categories' => $categories,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Master/MaterialCategory/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:material_categories,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        MaterialCategory::create($validated);

        return redirect()
            ->route('material-categories.index')
            ->with('success', 'Material category berhasil ditambahkan.');
    }

    public function edit(MaterialCategory $materialCategory)
    {
        return Inertia::render('Master/MaterialCategory/Edit', [
            'category' => $materialCategory,
        ]);
    }

    public function update(Request $request, MaterialCategory $materialCategory)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:material_categories,code,' . $materialCategory->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $materialCategory->update($validated);

        return redirect()
            ->route('material-categories.index')
            ->with('success', 'Material category berhasil diperbarui.');
    }

    public function destroy(MaterialCategory $materialCategory)
    {
        $materialCategory->delete();

        return redirect()
            ->route('material-categories.index')
            ->with('success', 'Material category berhasil dihapus.');
    }
}
