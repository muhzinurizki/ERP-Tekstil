<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Master\WarehouseController;
use App\Http\Controllers\Master\RawMaterialController;
use App\Http\Controllers\Master\SupplierController;
use App\Http\Controllers\Master\CustomerController;
use App\Http\Controllers\Master\MaterialCategoryController;
use App\Http\Controllers\Purchasing\PurchaseRequestController;
use App\Http\Controllers\Purchasing\PurchaseOrderController;
use App\Http\Controllers\Inventory\StockController;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->get('/dashboard', function () {
    return \Inertia\Inertia::render('Dashboard');
});

// Inventory placeholder route
Route::middleware('auth')->get('/inventory', function () {
    return \Inertia\Inertia::render('Inventory/Index');
});

// Production placeholder route
Route::middleware('auth')->get('/production', function () {
    return \Inertia\Inertia::render('Production/Index');
});

// Finance placeholder route
Route::middleware('auth')->get('/finance', function () {
    return \Inertia\Inertia::render('Finance/Index');
});

// Inventory route
Route::middleware('auth')->get('/inventory', function () {
    return \Inertia\Inertia::render('Inventory/Stock/Index');
});

// Purchasing placeholder route
Route::middleware('auth')->get('/purchasing', function () {
    return \Inertia\Inertia::render('Purchasing/Index');
});

// Users placeholder route
Route::middleware(['auth', 'role:admin'])->get('/users', function () {
    return \Inertia\Inertia::render('Users/Index');
});

Route::middleware(['auth', 'role:admin'])->prefix('master')->group(function () {
    Route::resource('warehouses', WarehouseController::class);
});

Route::middleware(['auth', 'role:admin'])->prefix('master')->group(function () {
    Route::resource('raw-materials', RawMaterialController::class);
});

Route::middleware(['auth'])->prefix('master')->group(function () {
    Route::resource(
        'material-categories',
        MaterialCategoryController::class
    )->except('show', 'destroy');
});

Route::middleware(['auth'])->prefix('master')->group(function () {
    Route::resource(
        'suppliers',
        SupplierController::class
    )->except('show');
});

Route::middleware(['auth'])->prefix('master')->group(function () {
    Route::resource(
        'customers',
        CustomerController::class
    )->except('show');
});

Route::middleware(['auth'])->prefix('purchasing')->group(function () {
    Route::resource(
        'purchase-requests',
        PurchaseRequestController::class
    )->except('show');

    Route::patch('/purchase-requests/{purchaseRequest}/submit', [
        PurchaseRequestController::class,
        'submit'
    ])->name('purchase-requests.submit');

    Route::patch('/purchase-requests/{purchaseRequest}/approve', [
        PurchaseRequestController::class,
        'approve'
    ])->name('purchase-requests.approve');

    Route::patch('/purchase-requests/{purchaseRequest}/reject', [
        PurchaseRequestController::class,
        'reject'
    ])->name('purchase-requests.reject');

    Route::get('/purchase-requests/{purchaseRequest}', [
        PurchaseRequestController::class,
        'show'
    ])->name('purchase-requests.show');
});

Route::middleware(['auth'])->prefix('purchasing')->group(function () {
    Route::resource(
        'purchase-requests',
        PurchaseRequestController::class
    )->except('show');

    Route::patch('/purchase-requests/{purchaseRequest}/submit', [
        PurchaseRequestController::class,
        'submit'
    ])->name('purchase-requests.submit');

    Route::patch('/purchase-requests/{purchaseRequest}/approve', [
        PurchaseRequestController::class,
        'approve'
    ])->name('purchase-requests.approve');

    Route::patch('/purchase-requests/{purchaseRequest}/reject', [
        PurchaseRequestController::class,
        'reject'
    ])->name('purchase-requests.reject');

    Route::get('/purchase-requests/{purchaseRequest}', [
        PurchaseRequestController::class,
        'show'
    ])->name('purchase-requests.show');

    Route::resource(
        'purchase-orders',
        PurchaseOrderController::class
    )->except('show');

    Route::patch('/purchase-orders/{purchaseOrder}/submit', [
        PurchaseOrderController::class,
        'submit'
    ])->name('purchase-orders.submit');

    Route::patch('/purchase-orders/{purchaseOrder}/approve', [
        PurchaseOrderController::class,
        'approve'
    ])->name('purchase-orders.approve');

    Route::patch('/purchase-orders/{purchaseOrder}/cancel', [
        PurchaseOrderController::class,
        'cancel'
    ])->name('purchase-orders.cancel');

    Route::get('/purchase-orders/{purchaseOrder}', [
        PurchaseOrderController::class,
        'show'
    ])->name('purchase-orders.show');
});

Route::middleware(['auth'])->prefix('inventory')->group(function () {
    Route::get('/stocks', [StockController::class, 'index'])->name('inventory.stocks.index');
    Route::get('/stocks/adjust', [StockController::class, 'adjust'])->name('inventory.stocks.adjust');
    Route::post('/stocks/adjust', [StockController::class, 'processAdjustment'])->name('inventory.stocks.process-adjustment');
    Route::get('/stocks/history', [StockController::class, 'history'])->name('inventory.stocks.history');
});


require __DIR__ . '/auth.php';