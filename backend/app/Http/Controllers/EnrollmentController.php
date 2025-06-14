<?php
// app/Http/Controllers/EnrollmentController.php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EnrollmentController extends Controller
{

    public function index()
    {
        $enrollments = Enrollment::with(['user', 'course'])
            ->paginate(10);
        
        return response()->json($enrollments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => [
                'required',
                'exists:courses,id',
                Rule::unique('enrollments')->where(function ($query) use ($request) {
                    return $query->where('user_id', $request->user()->id);
                })
            ]
        ]);

        $enrollment = Enrollment::create([
            'user_id' => $request->user()->id,
            'course_id' => $validated['course_id']
        ]);

        return response()->json([
            'message' => 'Successfully enrolled in course',
            'data' => $enrollment,
            'user'=>$request->user()->id
        ], 201);
    }

    public function myCourses(Request $request)
    {
        $courses = $request->user()
            ->enrolledCourses()
            ->with(['instructor', 'lessons'])
            ->get();

        return response()->json([
            'data' => $courses
        ]);
    }


    public function courseLessons(Request $request, Course $course)
    {
        $lessons = $course->lessons()
            ->orderBy('order')
            ->get()
            ->map(function ($lesson) use ($request) {
                $lesson->is_completed = $request->user()
                    ->lessonCompletions()
                    ->where('lesson_id', $lesson->id)
                    ->exists();
                return $lesson;
            });

        return response()->json([
            'data' => [
                'course' => $course->only(['id', 'title', 'description']),
                'lessons' => $lessons
            ]
        ]);
    }

    public function progress(Request $request, Course $course)
{
    $user = $request->user();
    
    $completedLessons = $user->lessonCompletions()
        ->whereIn('lesson_id', $course->lessons()->pluck('id'))
        ->count();
    
    $totalLessons = $course->lessons()->count();
    
    $lessons = $course->lessons()
        ->orderBy('order')
        ->get()
        ->map(function ($lesson) use ($user) {
            $completion = $user->lessonCompletions()
                ->where('lesson_id', $lesson->id)
                ->first();
            
            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'order' => $lesson->order,
                'duration' => $lesson->duration,
                'is_completed' => $completion !== null,
                'completed_at' => $completion?->completed_at,
            ];
        });
    
    return response()->json([
        'data' => [
            'course' => $course->only(['id', 'title', 'description']),
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'completion_percentage' => $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0,
            'total_duration' => $course->lessons()->sum('duration'),
            'lessons' => $lessons,
        ]
    ]);
}


public function progressOverview(Request $request)
{
    $courses = $request->user()
        ->enrolledCourses()
        ->withCount(['lessons', 'enrollments'])
        ->with(['instructor:id,name'])
        ->get()
        ->map(function ($course) use ($request) {
            $completed = $request->user()
                ->lessonCompletions()
                ->whereIn('lesson_id', $course->lessons->pluck('id'))
                ->count();
            
            return [
                'id' => $course->id,
                'title' => $course->title,
                'instructor' => $course->instructor,
                'total_lessons' => $course->lessons_count,
                'completed_lessons' => $completed,
                'completion_percentage' => $course->lessons_count > 0 
                    ? ($completed / $course->lessons_count) * 100 
                    : 0,
                'total_duration' => $course->lessons()->sum('duration'),
            ];
        });

    return response()->json(['data' => $courses]);
}

    /**
     * Get a specific lesson in an enrolled course
     */
    public function showLesson(Request $request, Course $course, Lesson $lesson)
    {
        // Ensure the lesson belongs to the course
        if ($lesson->course_id !== $course->id) {
            return response()->json([
                'message' => 'Lesson not found in this course'
            ], 404);
        }

        $lesson->is_completed = $request->user()
            ->lessonCompletions()
            ->where('lesson_id', $lesson->id)
            ->exists();

        // Get next and previous lessons
        $lesson->next_lesson = $course->lessons()
            ->where('order', '>', $lesson->order)
            ->orderBy('order')
            ->first();
            
        $lesson->previous_lesson = $course->lessons()
            ->where('order', '<', $lesson->order)
            ->orderBy('order', 'desc')
            ->first();

        return response()->json([
            'data' => $lesson
        ]);
    }

    /**
     * Mark a lesson as completed
     */
    public function completeLesson(Request $request, Course $course, Lesson $lesson)
    {
        // Ensure the lesson belongs to the course
        if ($lesson->course_id !== $course->id) {
            return response()->json([
                'message' => 'Lesson not found in this course'
            ], 404);
        }

        // Create or update lesson completion
        $request->user()->lessonCompletions()->updateOrCreate(
            ['lesson_id' => $lesson->id],
            ['completed_at' => now()]
        );

        return response()->json([
            'message' => 'Lesson marked as completed',
            'data' => [
                'completed_at' => now()->toDateTimeString()
            ]
        ]);
    }


    public function instructorEnrollments(){
        $enrollments = Enrollment::with(['user', 'course' => function($query) {
                $query->where('instructor_id', auth()->id());
            }])
            ->whereHas('course', function($query) {
                $query->where('instructor_id', auth()->id());
            })
            ->paginate(10);
        
        return response()->json($enrollments);
    }

    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();
        return response()->json(['message' => 'Enrollment deleted successfully']);
    }
}