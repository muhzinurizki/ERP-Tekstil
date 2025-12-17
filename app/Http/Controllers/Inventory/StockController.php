<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\StockMutation;
use App\Models\Warehouse;
use App\Models\RawMaterial;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * Display a listing of stock items
     */
    public function index(Request $request)
    {
        $query = Stock::with(['warehouse', 'rawMaterial.unit'])
            ->rawMaterial()
            ->orderBy('warehouse_id')
            ->orderBy('item_id');
        
        // Filter by warehouse if provided
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }
        
        // Search by raw material name if provided
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('rawMaterial', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }
        
        $stocks = $query->with(['warehouse', 'rawMaterial.unitRef'])->paginate(15)->withQueryString();
        
        // Get warehouses for filter dropdown
        $warehouses = Warehouse::orderBy('name')->get();
        
        // Determine if user can perform actions based on role
        $userRole = Auth::user()->role;
        
        return Inertia::render('Inventory/Stock/Index', [
            'stocks' => $stocks,
            'warehouses' => $warehouses,
            'filters' => $request->only(['warehouse_id', 'search']),
            'canAdjust' => $userRole === 'admin' || $userRole === 'staff',
            'canView' => true, // All authenticated users can view
        ]);
    }

    /**
     * Show stock adjustment form
     */
    public function adjust(Request $request)
    {
        $warehouses = Warehouse::orderBy('name')->get();
        $rawMaterials = RawMaterial::with('unitRef')->orderBy('name')->get();
        
        return Inertia::render('Inventory/Stock/Adjust', [
            'warehouses' => $warehouses,
            'rawMaterials' => $rawMaterials,
        ]);
    }

    /**
     * Process stock adjustment (IN/OUT)
     */
    public function processAdjustment(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'item_type' => 'required|in:raw_material',
            'item_id' => 'required|exists:raw_materials,id',
            'type' => 'required|in:in,out',
            'qty' => 'required|numeric|min:0.01',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|numeric',
            'notes' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            // Get the stock record or create new one
            $stock = Stock::firstOrCreate([
                'warehouse_id' => $validated['warehouse_id'],
                'item_type' => $validated['item_type'],
                'item_id' => $validated['item_id'],
            ], [
                'qty' => 0,
            ]);

            // Calculate new quantity based on type
            if ($validated['type'] === 'in') {
                $newQty = $stock->qty + $validated['qty'];
            } else { // out
                $newQty = $stock->qty - $validated['qty'];
                
                // Check if stock would go negative
                if ($newQty < 0) {
                    throw new \Exception('Stock tidak boleh minus');
                }
            }

            // Update stock
            $stock->update(['qty' => $newQty]);

            // Create stock mutation record
            StockMutation::create([
                'item_type' => $validated['item_type'],
                'item_id' => $validated['item_id'],
                'from_warehouse' => $validated['type'] === 'out' ? $validated['warehouse_id'] : null,
                'to_warehouse' => $validated['type'] === 'in' ? $validated['warehouse_id'] : null,
                'qty' => $validated['qty'],
                'reference_type' => $validated['reference_type'],
                'reference_id' => $validated['reference_id'],
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);
        });

        return redirect()
            ->route('inventory.stocks.index')
            ->with('success', 'Stock adjustment berhasil disimpan.');
    }

    /**
     * Show stock movement history
     */
    public function history(Request $request)
    {
        $query = StockMutation::with(['fromWarehouse', 'toWarehouse', 'rawMaterial.unit', 'createdBy'])
            ->orderBy('created_at', 'desc');

        // Filter by warehouse
        if ($request->filled('warehouse_id')) {
            $warehouseId = $request->warehouse_id;
            $query->where(function ($q) use ($warehouseId) {
                $q->where('from_warehouse', $warehouseId)
                  ->orWhere('to_warehouse', $warehouseId);
            });
        }

        // Filter by raw material
        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id)
                  ->where('item_type', 'raw_material');
        }

        // Filter by type (IN/OUT)
        if ($request->filled('type')) {
            if ($request->type === 'in') {
                $query->whereNotNull('to_warehouse');
            } elseif ($request->type === 'out') {
                $query->whereNotNull('from_warehouse');
            }
        }

        $mutations = $query->with(['fromWarehouse', 'toWarehouse', 'rawMaterial.unitRef', 'createdBy'])->paginate(15)->withQueryString();

        // Get warehouses and raw materials for filters
        $warehouses = Warehouse::orderBy('name')->get();
        $rawMaterials = RawMaterial::with('unitRef')->orderBy('name')->get();

        return Inertia::render('Inventory/Stock/History', [
            'mutations' => $mutations,
            'warehouses' => $warehouses,
            'rawMaterials' => $rawMaterials,
            'filters' => $request->only(['warehouse_id', 'item_id', 'type']),
        ]);
    }
}