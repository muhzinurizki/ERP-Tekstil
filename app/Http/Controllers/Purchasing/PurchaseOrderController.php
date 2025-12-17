<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\RawMaterial;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'createdBy', 'items'])->orderBy('created_at', 'desc');
        
        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by supplier if provided
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }
        
        // Filter by PO number if provided
        if ($request->filled('search')) {
            $query->where('po_number', 'like', '%' . $request->search . '%');
        }
        
        // RBAC: Only show relevant POs based on user role
        if (Auth::user()->role !== 'admin') {
            if (Auth::user()->role === 'manager') {
                // Manager can see all POs
                // No additional filtering needed
            } else {
                // Staff can only see their own POs
                $query->where('created_by', Auth::id());
            }
        }
        
        $purchaseOrders = $query->paginate(10)->withQueryString();
        
        // Get suppliers for filter dropdown
        $suppliers = Supplier::orderBy('name')->get();
        
        return Inertia::render('Purchasing/PurchaseOrder/Index', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'filters' => $request->only(['status', 'supplier_id', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $suppliers = Supplier::orderBy('name')->get();
        $rawMaterials = RawMaterial::with('unitRef')->get();
        
        // If creating from a PR
        $purchaseRequest = null;
        if ($request->filled('from_pr')) {
            $purchaseRequest = PurchaseRequest::with(['items.rawMaterial.unitRef'])->find($request->from_pr);
            
            // Validate that PR exists and is approved
            if (!$purchaseRequest || $purchaseRequest->status !== 'approved') {
                abort(404, 'Purchase Request tidak ditemukan atau belum disetujui');
            }
        }
        
        return Inertia::render('Purchasing/PurchaseOrder/Create', [
            'suppliers' => $suppliers,
            'rawMaterials' => $rawMaterials,
            'purchaseRequest' => $purchaseRequest,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'po_date' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_request_id' => 'nullable|exists:purchase_requests,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => 'required|exists:raw_materials,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        $purchaseOrder = PurchaseOrder::create([
            'po_date' => $validated['po_date'],
            'supplier_id' => $validated['supplier_id'],
            'purchase_request_id' => $validated['purchase_request_id'],
            'created_by' => Auth::id(),
            'status' => 'draft',
            'notes' => $validated['notes'],
        ]);

        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $purchaseOrder->id,
                'raw_material_id' => $item['raw_material_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return redirect()
            ->route('purchase-orders.index')
            ->with('success', 'Purchase Order berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        // Authorization: check if user can view this PO
        $this->authorizeView($purchaseOrder);

        $purchaseOrder->load(['supplier', 'createdBy', 'items.rawMaterial.unitRef']);
        
        return Inertia::render('Purchasing/PurchaseOrder/Show', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseOrder $purchaseOrder)
    {
        // Only allow editing if status is 'draft'
        if ($purchaseOrder->status !== 'draft') {
            abort(403, 'Hanya Purchase Order dengan status draft yang dapat diedit.');
        }

        // Authorization: only the creator can edit if they're not admin/manager
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'manager' && $purchaseOrder->created_by !== Auth::id()) {
            abort(403, 'Anda tidak dapat mengedit Purchase Order ini.');
        }

        $purchaseOrder->load(['items.rawMaterial.unitRef']);
        $suppliers = Supplier::orderBy('name')->get();
        $rawMaterials = RawMaterial::with('unitRef')->get();
        
        return Inertia::render('Purchasing/PurchaseOrder/Create', [
            'purchaseOrder' => $purchaseOrder,
            'suppliers' => $suppliers,
            'rawMaterials' => $rawMaterials,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Only allow updating if status is 'draft'
        if ($purchaseOrder->status !== 'draft') {
            abort(403, 'Hanya Purchase Order dengan status draft yang dapat diperbarui.');
        }

        // Authorization: only the creator can update if they're not admin/manager
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'manager' && $purchaseOrder->created_by !== Auth::id()) {
            abort(403, 'Anda tidak dapat memperbarui Purchase Order ini.');
        }

        $validated = $request->validate([
            'po_date' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_request_id' => 'nullable|exists:purchase_requests,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => 'required|exists:raw_materials,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        $purchaseOrder->update([
            'po_date' => $validated['po_date'],
            'supplier_id' => $validated['supplier_id'],
            'purchase_request_id' => $validated['purchase_request_id'],
            'notes' => $validated['notes'],
        ]);

        // Delete old items
        $purchaseOrder->items()->delete();

        // Add new items
        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $purchaseOrder->id,
                'raw_material_id' => $item['raw_material_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return redirect()
            ->route('purchase-orders.index')
            ->with('success', 'Purchase Order berhasil diperbarui.');
    }

    /**
     * Submit the specified resource for approval.
     */
    public function submit(Request $request, PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'draft') {
            abort(400, 'Hanya Purchase Order dengan status draft yang dapat disubmit.');
        }

        // Only the creator can submit
        if ($purchaseOrder->created_by !== Auth::id()) {
            abort(403, 'Hanya pembuat Purchase Order yang dapat submit.');
        }

        $purchaseOrder->update(['status' => 'submitted']);

        return redirect()
            ->route('purchase-orders.index')
            ->with('success', 'Purchase Order berhasil disubmit untuk approval.');
    }

    /**
     * Approve the specified resource.
     */
    public function approve(Request $request, PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'submitted') {
            abort(400, 'Hanya Purchase Order dengan status submitted yang dapat di-approve.');
        }

        // Only managers can approve
        if (Auth::user()->role !== 'manager') {
            abort(403, 'Hanya manager yang dapat melakukan approval.');
        }

        $purchaseOrder->update(['status' => 'approved']);

        return redirect()
            ->route('purchase-orders.index')
            ->with('success', 'Purchase Order berhasil di-approve.');
    }

    /**
     * Cancel the specified resource.
     */
    public function cancel(Request $request, PurchaseOrder $purchaseOrder)
    {
        if (!in_array($purchaseOrder->status, ['draft', 'submitted'])) {
            abort(400, 'Hanya Purchase Order dengan status draft atau submitted yang dapat dicancel.');
        }

        // Managers can cancel submitted POs, staff can cancel their own draft POs
        $user = Auth::user();
        if ($user->role !== 'manager' && 
            !($user->role !== 'staff' && $purchaseOrder->created_by === Auth::id() && $purchaseOrder->status === 'draft')) {
            abort(403, 'Anda tidak dapat membatalkan Purchase Order ini.');
        }

        $purchaseOrder->update(['status' => 'cancelled']);

        return redirect()
            ->route('purchase-orders.index')
            ->with('success', 'Purchase Order berhasil dibatalkan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Check if user is authorized to view the purchase order based on role
     */
    private function authorizeView(PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            return true; // Admin can view all
        }
        
        if ($user->role === 'manager') {
            return true; // Manager can view all
        }
        
        // Staff can only view their own POs
        if ($purchaseOrder->created_by === $user->id) {
            return true;
        }
        
        abort(403, 'Anda tidak dapat melihat Purchase Order ini.');
    }
}