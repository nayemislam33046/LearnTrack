<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class AdminStatsController extends Controller
{
    public function index()
    {
        // Verify admin role (middleware handles this)
        
        return response()->json([
            'totalUsers' => User::where('role', '!=', 'admin')->count(),
            'totalCourses' => Course::count(),
            // 'activeCourses' => Course::where('status', 'active')->count(),
            'totalEnrollments' => Enrollment::count(),
            'newUsersThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
            
        ]);
    }

    public function recentUsers()
    {
        $users = User::where('role', '!=', 'admin')->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,                 
                    'role' => $user->role,                 
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'data' => $users
        ]);
    }

    public function viewAllUser(){
        $users = User::where('role', '!=', 'admin')->get();

        return response()->json([
            'data' => $users
        ]);
    }


    // AdminStatsController.php
public function destroy($id) {
    try {
        $user = User::findOrFail($id); // Find the user (even if soft-deleted)
        $user->forceDelete(); // Permanently deletes the record
        return response()->json(["message" => "User permanently deleted"]);
    } catch (\Exception $e) {
        return response()->json(["error" => "Deletion failed: " . $e->getMessage()], 500);
    }
}
}