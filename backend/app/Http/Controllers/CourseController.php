<?php
// app/Http/Controllers/CourseController.php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    // GET /api/courses — List all (admin) / own (instructor)
    public function index()
    {
        $query = Course::with('instructor:id,name,email')->withCount('lessons');;

        if (auth()->user()->isInstructor()) {
            $query->where('instructor_id', auth()->id());
        }

        $courses = $query->get();

        return response()->json($courses);
    }

    // GET /api/courses/{id} — Show single course with lessons
public function show(Course $course): JsonResponse
{
    // Load relationships and counts
    $course->load([
        'instructor:id,name,email',
        'lessons' => function ($query) {
            $query->orderBy('order');
        },
        'enrollments' => function ($query) {
            $query->with('user:id,name');
        }
    ])->loadCount([
        'lessons',
        'enrollments'
    ]);

    // Add additional data based on user role
    if (auth()->user()->isAdmin()) {
        // Admin sees all details
        return response()->json($course);
    }

    if (auth()->user()->isInstructor()) {
        // Instructor only sees their own course details
        if ($course->instructor_id !== auth()->id()) {
            abort(403, 'Unauthorized to view this course');
        }

        // Add completion stats for instructor view
        $course->completion_stats = [
            'total_students' => $course->enrollments_count,
            'completed_lessons' => $course->lessons()
                ->whereHas('completions')
                ->count(),
            'average_progress' => $course->enrollments()
                ->withCount('completedLessons')
                ->get()
                ->avg(function ($enrollment) use ($course) {
                    return $course->lessons_count > 0 
                        ? ($enrollment->completed_lessons_count / $course->lessons_count) * 100 
                        : 0;
                })
        ];

        return response()->json($course);
    }

    // For students, check enrollment status
    $course->is_enrolled = auth()->user()->enrolledIn($course);
    
    // Only show lessons if enrolled (or optionally show preview)
    if (!$course->is_enrolled) {
        $course->unsetRelation('lessons');
        $course->preview_lessons = $course->lessons()
            ->where('is_free', true)
            ->orderBy('order')
            ->take(2)
            ->get();
    }

    return response()->json($course);
}

    // POST /api/courses — Create new course
    public function store(StoreCourseRequest $request)
    {
        Gate::authorize('create', Course::class);

         $path = null;
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'instructor_id' => auth()->user()->role === 'admin' 
                        ? $request->instructor_id 
                        : auth()->id(),
            'thumbnail' => $path
        ]);

        return response()->json($course, 201);
    }

    // PUT /api/courses/{id} — Update course
    public function update(UpdateCourseRequest $request, Course $course)
{
    Gate::authorize('update', $course);

    if ($request->hasFile('thumbnail')) {
        
        if ($course->thumbnail) {
            \Storage::disk('public')->delete($course->thumbnail);
        }

        $path = $request->file('thumbnail')->store('thumbnails', 'public');
        $course->thumbnail = $path;
    }

    $course->update([
        'title' => $request->title,
        'description' => $request->description,
        'instructor_id' => auth()->user()->role === 'admin' 
                            ? $request->instructor_id 
                            : auth()->id(),
        'thumbnail' => $course->thumbnail
    ]);

    return response()->json($course);
}


    // DELETE /api/courses/{id} — Delete course
    public function destroy(Course $course)
    {
        Gate::authorize('delete', $course);

        $course->delete();

        return response()->json(["message"=>"successfully deleted"]);
    }

}