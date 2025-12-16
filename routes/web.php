<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Master\WarehouseController;
use App\Http\Controllers\Master\RawMaterialController;
use App\Http\Controllers\Master\SupplierController;

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

Route::middleware(['auth', 'role:admin'])->prefix('master')->group(function () {
    Route::resource('warehouses', WarehouseController::class);
});

Route::middleware(['auth', 'role:admin'])->prefix('master')->group(function () {
    Route::resource('raw-materials', RawMaterialController::class);
});

Route::middleware(['auth'])->prefix('master')->group(function () {
    Route::resource(
        'material-categories',
        \App\Http\Controllers\Master\MaterialCategoryController::class
    )->except('show', 'destroy');
});

Route::middleware(['auth'])->prefix('master')->group(function () {
    Route::resource(
        'suppliers',
        \App\Http\Controllers\Master\SupplierController::class
    )->except('show');
});

require __DIR__ . '/auth.php';