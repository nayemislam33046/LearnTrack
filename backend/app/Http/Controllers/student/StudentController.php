<?php
namespace App\Http\Controllers\student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function stats()
    {
        $userId = Auth::id();
        
        // Get all courses the student is enrolled in
        $enrolledCourseIds = Enrollment::where('user_id', $userId)
            ->pluck('course_id')
            ->toArray();
        
        // Count lessons in enrolled courses
        $totalLessonsInEnrolledCourses = Lesson::whereIn('course_id', $enrolledCourseIds)
            ->count();
            
        // Count completed lessons in enrolled courses
        $completedLessons = Lesson::whereIn('course_id', $enrolledCourseIds)
            ->whereHas('completions', function($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->count();
            
        // Count in-progress lessons (in enrolled courses but not completed)
        $inProgressLessons = Lesson::whereIn('course_id', $enrolledCourseIds)
            ->whereDoesntHave('completions', function($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->count();

        return response()->json([
            'totalEnrolledCourses' => count($enrolledCourseIds),
            'totalLessonsInEnrolledCourses' => $totalLessonsInEnrolledCourses,
            'completedCourses' => $completedLessons,
            'inProgressCourses' => $inProgressLessons,
            'progressPercentage' => $totalLessonsInEnrolledCourses > 0 
                ? round(($completedLessons / $totalLessonsInEnrolledCourses) * 100)
                : 0
        ]);
    }
}