<?php
// app/Models/Enrollment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'course_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function student()
{
    return $this->belongsTo(User::class, 'user_id');
}

    public function completedLessons()
    {
        return $this->hasManyThrough(
            LessonCompletion::class,
            Lesson::class,
            'course_id', // Foreign key on lessons table
            'lesson_id', // Foreign key on lesson_completions table
            'course_id', // Local key on enrollments table
            'id' // Local key on lessons table
        )->where('lesson_completions.user_id', $this->user_id);
    }
}