<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'video_url',
        'notes',
        'order',
        'duration'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function completions()
{
    return $this->hasMany(LessonCompletion::class);
}

public function progress()
{
    return $this->hasMany(UserProgress::class);
}

public function userProgress()
{
    return $this->hasOne(UserProgress::class)->where('user_id', auth()->id());
}

public function userCompletion()
{
    return $this->hasOne(LessonCompletion::class)->where('user_id', auth()->id());
}


}