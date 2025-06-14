<?php
namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Lesson;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserProgressController extends Controller
{
    public function overview(User $user)
    {
        $courses = $user->enrolledCourses()->with('lessons')->get();

        $data = [];

        foreach ($courses as $course) {
            $total = $course->lessons->count();

            $completed = $course->lessons->filter(function ($lesson) use ($user) {
                return $lesson->completions && $lesson->completions->contains('user_id', $user->id);
            })->count();


            $percentage = $total > 0 ? round(($completed / $total) * 100) : 0;

            $data[] = [
                'course_id'    => $course->id,
                'course_title' => $course->title,
                'percentage'   => $percentage,
                'completed'    => $completed,
                'total'        => $total,
            ];
        }

        return response()->json($data);
    }
}
