<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePhotographer
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user?->photographer) {
            return response()->json(['message' => 'Photographer profile required.'], 403);
        }

        $request->attributes->set('photographer', $user->photographer);

        return $next($request);
    }
}
