<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Temporarily store existing data
        $existingRecords = DB::table('purchase_requests')->get();

        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->date('request_date')->nullable()->after('pr_number');
            $table->text('notes')->nullable()->after('status');
            $table->dropColumn('status');
        });

        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected'])->default('draft')->after('request_date');
        });

        // Restore the existing data with the new status values
        foreach ($existingRecords as $record) {
            // Map old status to new status (pending -> submitted for better mapping)
            $newStatus = match($record->status) {
                'pending' => 'submitted',
                'approved' => 'approved',
                'rejected' => 'rejected',
                default => 'draft'
            };

            DB::table('purchase_requests')
                ->where('id', $record->id)
                ->update(['status' => $newStatus]);
        }

        Schema::table('purchase_request_items', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('qty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Temporarily store existing data
        $existingRecords = DB::table('purchase_requests')->get();

        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->dropColumn(['request_date', 'notes', 'status']);
        });

        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        });

        // Restore the existing data with the old status values
        foreach ($existingRecords as $record) {
            // Map new status back to old status
            $oldStatus = match($record->status) {
                'draft' => 'pending',
                'submitted' => 'pending',
                'approved' => 'approved',
                'rejected' => 'rejected',
                default => 'pending'
            };

            DB::table('purchase_requests')
                ->where('id', $record->id)
                ->update(['status' => $oldStatus]);
        }

        Schema::table('purchase_request_items', function (Blueprint $table) {
            $table->dropColumn(['notes']);
        });
    }
};
