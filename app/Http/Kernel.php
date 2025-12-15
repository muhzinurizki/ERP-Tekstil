<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
  /**
   * Global HTTP middleware stack.
   */
  protected $middleware = [
    \Illuminate\Http\Middleware\HandleCors::class,
  ];

  /**
   * Route middleware aliases.
   *
   * Dipakai di route:
   * middleware('auth')
   * middleware('role:admin')
   */
  protected $middlewareAliases = [
    // AUTH
    'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
    'guest' => \Illuminate\Auth\Middleware\RedirectIfAuthenticated::class,

    // RBAC (CUSTOM)
    'role' => \App\Http\Middleware\RoleMiddleware::class,
  ];
}
