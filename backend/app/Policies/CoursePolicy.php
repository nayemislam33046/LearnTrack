<?php 
// app/Policies/CoursePolicy.php
namespace App\Policies;

use App\Models\User;
use App\Models\Course;

class CoursePolicy
{
    public function viewAny(User $user)
    {
        return true; // Both admin and instructors can view courses
    }

    public function view(User $user, Course $course)
    {
        return $user->isAdmin() || $user->id === $course->instructor_id;
    }

    public function create(User $user)
    {
        return $user->isInstructor() || $user->isAdmin();
    }

    public function update(User $user, Course $course)
    {
        return $user->isAdmin() || $user->id === $course->instructor_id;
    }

    public function delete(User $user, Course $course)
    {
        return $user->isAdmin() || $user->id === $course->instructor_id;
    }
}