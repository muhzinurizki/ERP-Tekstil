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
        $existingRecords = DB::table('purchase_orders')->get();

        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->date('po_date')->nullable()->after('po_number');
            $table->foreignId('created_by')->nullable()->constrained('users')->after('supplier_id');
            $table->foreignId('purchase_request_id')->nullable()->constrained()->after('supplier_id');
            $table->text('notes')->nullable()->after('status');
            $table->dropColumn('status');
        });

        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->enum('status', ['draft', 'submitted', 'approved', 'cancelled'])->default('draft');
        });

        // Restore the existing data with the new status values
        foreach ($existingRecords as $record) {
            // Map old status to new status
            $newStatus = match($record->status) {
                'open' => 'submitted',  // Map open to submitted
                'closed' => 'approved', // Map closed to approved
                default => 'draft'      // Default to draft
            };

            DB::table('purchase_orders')
                ->where('id', $record->id)
                ->update([
                    'status' => $newStatus,
                    'po_date' => $record->created_at, // Use created_at as initial PO date
                    'created_by' => 1, // Default to first user
                    'notes' => null
                ]);
        }

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('qty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Temporarily store existing data
        $existingRecords = DB::table('purchase_orders')->get();

        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropColumn(['po_date', 'created_by', 'purchase_request_id', 'notes', 'status']);
        });

        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->enum('status', ['open', 'closed'])->default('open');
        });

        // Restore the existing data with old status values
        foreach ($existingRecords as $record) {
            // Map new status back to old status
            $oldStatus = match($record->status) {
                'draft' => 'open',
                'submitted' => 'open',
                'approved' => 'closed',
                'cancelled' => 'closed',
                default => 'open'
            };

            DB::table('purchase_orders')
                ->where('id', $record->id)
                ->update(['status' => $oldStatus]);
        }

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropColumn(['notes']);
        });
    }
};
