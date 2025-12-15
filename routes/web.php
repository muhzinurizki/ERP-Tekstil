<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

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

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/users', function () {
        return 'User management (admin only)';
    });
});

Route::middleware(['auth', 'role:manager'])->group(function () {
    Route::get('/approvals', function () {
        return 'Approval page (manager only)';
    });
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'role:admin'])->get('/admin-test', function () {
    return 'INI HALAMAN ADMIN';
});

Route::middleware(['auth', 'role:manager'])->get('/manager-test', function () {
    return 'INI HALAMAN MANAGER';
});
