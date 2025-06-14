<?php

namespace App\Http\Controllers\Instructor;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;

class InstructorController extends Controller
{
    function index() {
      $user = User::whereIn('role', ['admin', 'instructor'])->get();
    return $user;
    }

    function recentCourse(){
      $course = Course::where("instructor_id",auth()->id())->latest()->take(5)->get();
      return $course;
    }

    function stats(){
      $instructor = auth()->user();
    $courses = Course::where('instructor_id', $instructor->id)->withCount('enrollments')->get();
    $totalEnrollments = $courses->sum('enrollments_count');

      return response()->json([
            'totalStudents' => User::where('role','student')->count(),
            'totalCourses' => Course::where('instructor_id',auth()->id())->withCount('enrollments')->count(),
            'totalEnrollments' => $totalEnrollments,
            'newUsersThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
            
        ]);
    }

public function getInstructorStudents()
{
    $instructorId = auth()->id();
    $students = Enrollment::with('student')
        ->whereHas('course', function ($query) use ($instructorId) {
            $query->where('instructor_id', $instructorId);
        })
        ->get()
        ->pluck('student')
        ->unique('id')
        ->values();

    return response()->json([
        'students' => $students,
    ]);
}

}
