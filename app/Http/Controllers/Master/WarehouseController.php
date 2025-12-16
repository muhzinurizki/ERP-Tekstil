<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index(Request $request)
{
    $warehouses = Warehouse::query()
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        })
        ->orderBy('name')
        ->get();

    return Inertia::render('Master/Warehouse/Index', [
        'warehouses' => $warehouses,
        'filters' => $request->only('search'),
    ]);
}


    public function create()
    {
        return Inertia::render('Master/Warehouse/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'location' => 'nullable|string|max:255',
        ]);

        Warehouse::create($validated);

        return redirect()
            ->route('warehouses.index')
            ->with('success', 'Warehouse berhasil ditambahkan');
    }

    public function edit(Warehouse $warehouse)
    {
        return Inertia::render('Master/Warehouse/Edit', [
            'warehouse' => $warehouse,
        ]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'location' => 'nullable|string|max:255',
        ]);

        $warehouse->update($validated);

        return redirect()
            ->route('warehouses.index')
            ->with('success', 'Warehouse berhasil diperbarui');
    }

    public function destroy(Warehouse $warehouse)
{
    $warehouse->delete();

    return redirect()
        ->route('warehouses.index')
        ->with('success', 'Warehouse berhasil dihapus');
}
}