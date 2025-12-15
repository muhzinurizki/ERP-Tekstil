<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Master\WarehouseController;

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

require __DIR__ . '/auth.php';