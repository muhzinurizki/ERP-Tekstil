<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Models\PurchaseRequest;
use App\Models\PurchaseRequestItem;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PurchaseRequest::with(['requestedBy', 'items'])->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by PR number if provided
        if ($request->filled('search')) {
            $query->where('pr_number', 'like', '%' . $request->search . '%');
        }

        // RBAC: Only show relevant PRs based on user role
        if (Auth::user()->role !== 'admin') {
            if (Auth::user()->role === 'manager') {
                // Manager can see all PRs
                // No additional filtering needed
            } else {
                // Staff can only see their own PRs
                $query->where('requested_by', Auth::id());
            }
        }

        $purchaseRequests = $query->paginate(10)->withQueryString();

        return Inertia::render('Purchasing/PurchaseRequest/Index', [
            'purchaseRequests' => $purchaseRequests,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $rawMaterials = RawMaterial::select('id', 'name', 'unit_id')->get();

        return Inertia::render('Purchasing/PurchaseRequest/Create', [
            'rawMaterials' => $rawMaterials,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => 'required|exists:raw_materials,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.notes' => 'nullable|string',
        ]);

        $purchaseRequest = PurchaseRequest::create([
            'request_date' => $validated['request_date'],
            'requested_by' => Auth::id(),
            'status' => 'draft',
            'notes' => $validated['notes'],
        ]);

        foreach ($validated['items'] as $item) {
            PurchaseRequestItem::create([
                'purchase_request_id' => $purchaseRequest->id,
                'raw_material_id' => $item['raw_material_id'],
                'qty' => $item['qty'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return redirect()
            ->route('purchase-requests.index')
            ->with('success', 'Purchase Request berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseRequest $purchaseRequest)
    {
        // Authorization: check if user can view this PR
        $this->authorizeView($purchaseRequest);

        $purchaseRequest->load(['requestedBy', 'items.rawMaterial']);

        return Inertia::render('Purchasing/PurchaseRequest/Show', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseRequest $purchaseRequest)
    {
        // Only allow editing if status is 'draft'
        if ($purchaseRequest->status !== 'draft') {
            abort(403, 'Hanya Purchase Request dengan status draft yang dapat diedit.');
        }

        // Authorization: only the creator can edit if they're not admin/manager
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'manager' && $purchaseRequest->requested_by !== Auth::id()) {
            abort(403, 'Anda tidak dapat mengedit Purchase Request ini.');
        }

        $purchaseRequest->load(['items.rawMaterial']);
        $rawMaterials = RawMaterial::select('id', 'name', 'unit_id')->get();

        return Inertia::render('Purchasing/PurchaseRequest/Create', [
            'purchaseRequest' => $purchaseRequest,
            'rawMaterials' => $rawMaterials,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseRequest $purchaseRequest)
    {
        // Only allow updating if status is 'draft'
        if ($purchaseRequest->status !== 'draft') {
            abort(403, 'Hanya Purchase Request dengan status draft yang dapat diperbarui.');
        }

        // Authorization: only the creator can update if they're not admin/manager
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'manager' && $purchaseRequest->requested_by !== Auth::id()) {
            abort(403, 'Anda tidak dapat memperbarui Purchase Request ini.');
        }

        $validated = $request->validate([
            'request_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => 'required|exists:raw_materials,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.notes' => 'nullable|string',
        ]);

        $purchaseRequest->update([
            'request_date' => $validated['request_date'],
            'notes' => $validated['notes'],
        ]);

        // Delete old items
        $purchaseRequest->items()->delete();

        // Add new items
        foreach ($validated['items'] as $item) {
            PurchaseRequestItem::create([
                'purchase_request_id' => $purchaseRequest->id,
                'raw_material_id' => $item['raw_material_id'],
                'qty' => $item['qty'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return redirect()
            ->route('purchase-requests.index')
            ->with('success', 'Purchase Request berhasil diperbarui.');
    }

    /**
     * Submit the specified resource for approval.
     */
    public function submit(Request $request, PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->status !== 'draft') {
            abort(400, 'Hanya Purchase Request dengan status draft yang dapat disubmit.');
        }

        // Only the creator can submit
        if ($purchaseRequest->requested_by !== Auth::id()) {
            abort(403, 'Hanya pembuat Purchase Request yang dapat submit.');
        }

        $purchaseRequest->update(['status' => 'submitted']);

        return redirect()
            ->route('purchase-requests.index')
            ->with('success', 'Purchase Request berhasil disubmit untuk approval.');
    }

    /**
     * Approve the specified resource.
     */
    public function approve(Request $request, PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->status !== 'submitted') {
            abort(400, 'Hanya Purchase Request dengan status submitted yang dapat di-approve.');
        }

        // Only managers can approve
        if (Auth::user()->role !== 'manager') {
            abort(403, 'Hanya manager yang dapat melakukan approval.');
        }

        $purchaseRequest->update(['status' => 'approved']);

        return redirect()
            ->route('purchase-requests.index')
            ->with('success', 'Purchase Request berhasil di-approve.');
    }

    /**
     * Reject the specified resource.
     */
    public function reject(Request $request, PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->status !== 'submitted') {
            abort(400, 'Hanya Purchase Request dengan status submitted yang dapat di-reject.');
        }

        // Only managers can reject
        if (Auth::user()->role !== 'manager') {
            abort(403, 'Hanya manager yang dapat melakukan rejection.');
        }

        $purchaseRequest->update(['status' => 'rejected']);

        return redirect()
            ->route('purchase-requests.index')
            ->with('success', 'Purchase Request berhasil di-reject.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Check if user is authorized to view the purchase request based on role
     */
    private function authorizeView(PurchaseRequest $purchaseRequest)
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return true; // Admin can view all
        }

        if ($user->role === 'manager') {
            return true; // Manager can view all
        }

        // Staff can only view their own PRs
        if ($purchaseRequest->requested_by === $user->id) {
            return true;
        }

        abort(403, 'Anda tidak dapat melihat Purchase Request ini.');
    }
}
