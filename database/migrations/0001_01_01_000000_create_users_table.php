<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Họ và tên
            $table->string('email')->unique(); // Email đăng nhập
            $table->timestamp('email_verified_at')->nullable(); // Thời gian verify email
            $table->string('password'); // Mật khẩu đã hash
            $table->enum('role', ['admin', 'customer'])->default('customer'); // Vai trò người dùng
            $table->string('phone', 10)->nullable(); // Số điện thoại
            $table->enum('gender', ['male', 'female', 'other'])->nullable(); // Giới tính
            $table->date('date_of_birth')->nullable(); // Ngày sinh
            $table->string('avatar')->nullable(); // Đường dẫn ảnh đại diện
            $table->boolean('is_active')->default(true); // Trạng thái hoạt động
            $table->rememberToken();
            $table->timestamps(); // created_at, updated_at
            $table->timestamp('deleted_at')->nullable(); // Thời gian xóa (soft delete)
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
