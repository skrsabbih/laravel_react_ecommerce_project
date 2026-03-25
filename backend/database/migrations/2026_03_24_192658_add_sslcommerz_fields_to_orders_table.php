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
        Schema::table('orders', function (Blueprint $table) {
            // for sslcommerz
            $table->string('tran_id')->nullable()->after('zip');
            $table->string('val_id')->nullable()->after('tran_id');
            $table->string('bank_tran_id')->nullable()->after('val_id');
            $table->string('card_type')->nullable()->after('bank_tran_id');
            $table->longText('gateway_response')->nullable()->after('card_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // for sslcommerz
            $table->dropColumn([
                'tran_id',
                'val_id',
                'bank_tran_id',
                'card_type',
                'gateway_response',
            ]);
        });
    }
};
