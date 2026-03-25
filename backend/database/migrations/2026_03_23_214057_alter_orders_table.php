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
        // orders table add payment_method
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_method', ['cod', 'stripe', 'bkash', 'nagad','sslcommerz'])->after('payment_status')->default('cod');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // drop table
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });
    }
};
