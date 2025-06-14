<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Lesson;

class LessonPolicy
{
    public function update(User $user, Lesson $lesson)
    {
        return $user->id === $lesson->course->instructor_id || $user->role === 'admin';
    }

    public function delete(User $user, Lesson $lesson)
    {
        return $user->id === $lesson->course->instructor_id || $user->role === 'admin';
    }
}