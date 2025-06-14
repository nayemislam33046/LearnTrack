<?php

namespace App\Http\Middleware;

use App\Models\Course;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsEnrolled
{
    public function handle(Request $request, Closure $next)
    {
        $course = $request->route('course');

        // Check if course exists and is valid
        if (!$course instanceof Course) {
            return response()->json([
                'message' => 'Course not found or invalid'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Check enrollment status
        if (!$request->user()->enrolledIn($course)) {
            return response()->json([
                'message' => 'You are not enrolled in this course'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}