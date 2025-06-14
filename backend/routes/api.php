<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\admin\DashBoardController;
use App\Http\Controllers\admin\AdminStatsController;
use App\Http\Controllers\Instructor\InstructorController;
use App\Http\Controllers\student\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\API\UserProgressController;



Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return Auth::user()->load('enrollments');
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::resource('/courses', CourseController::class);

    //admin route
    Route::get('/admin/stats', [AdminStatsController::class, 'index']);
    Route::delete('/admin/deleteuser/{id}', [AdminStatsController::class, 'destroy']);
    Route::get('/admin/all-users', [AdminStatsController::class, 'viewAllUser']);
    Route::get('/admin/recent-users', [AdminStatsController::class, 'recentUsers']);
    Route::get('/admin/enrollments', [EnrollmentController::class, 'index']);
    Route::delete('/admin/enrollments/{enrollment}', [EnrollmentController::class, 'destroy']);

    //instructor route 
    Route::get('/instructors', [InstructorController::class, 'index']);
    Route::get('/instructors/stats', [InstructorController::class, 'stats']);
    Route::get('/instructors/recent-courses', [InstructorController::class, 'recentCourse']);
    Route::get('/instructors/my-students', [InstructorController::class, 'getInstructorStudents']);
    Route::get('/instructors/enrollments', [EnrollmentController::class, 'instructorEnrollments']);

    //student route
    Route::get('/student/stats',[StudentController::class,'stats']);

    //lesson route 
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
    Route::post('/courses/{course}/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);
    Route::get('/courses/{course}/lessons/{lesson}', [LessonController::class, 'showByCourse']);

     // Enrollment routes
    Route::post('/enroll', [EnrollmentController::class, 'store']);
    Route::get('/my-courses', [EnrollmentController::class, 'myCourses']);
    
    // Protected lesson routes
    Route::middleware('enrolled')->group(function () {
        Route::get('/my-courses/{course}/lessons', [EnrollmentController::class, 'courseLessons']);
        Route::get('/my-courses/{course}/lessons/{lesson}', [EnrollmentController::class, 'showLesson']);
        Route::post('/my-courses/{course}/lessons/{lesson}/complete', [EnrollmentController::class, 'completeLesson']);
        Route::get('/my-courses/{course}/progress',[EnrollmentController::class, 'progress']);
    });

    // Progress Tracking
    Route::get('/users/{user}/progress-overview', [UserProgressController::class, 'overview']);

});
