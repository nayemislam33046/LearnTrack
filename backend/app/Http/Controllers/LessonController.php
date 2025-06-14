<?php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class LessonController extends Controller
{
     use AuthorizesRequests;

   public function index(Course $course)
    {
        return response()->json($course->lessons);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'video_url' => 'required|url',
            'notes' => 'nullable|string',
            'order' => 'required|integer' 
        ]);

        $lesson = $course->lessons()->create($validated);
        return response()->json($lesson, 201);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $this->authorize('update', $lesson->course);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'video_url' => 'sometimes|url',
            'notes' => 'nullable|string',
            'order' => 'sometimes|integer'
        ]);

        $lesson->update($validated);
        return response()->json($lesson);
    }
    
    public function destroy(Lesson $lesson)
    {
        $this->authorize('delete', $lesson->course);
        $lesson->delete();
        return response()->json(["messages"=>"deleted"], 200);
    }

    public function showByCourse(Course $course, Lesson $lesson)
{
    // Verify lesson belongs to course
    if ($lesson->course_id !== $course->id) {
        abort(404);
    }
    return response()->json($lesson);
}
}