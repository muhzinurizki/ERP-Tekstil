<?php

namespace App\Support;

use Illuminate\Support\Str;
use App\Models\RawMaterial;

class MaterialCodeGenerator
{
    public static function generate(string $name): string
    {
        $category = self::detectCategory($name);
        $short = self::makeShortName($name);

        $prefix = "RM-{$category}-{$short}-";

        $lastSeq = RawMaterial::where('code', 'like', $prefix . '%')
            ->orderBy('code', 'desc')
            ->value('code');

        $next = 1;
        if ($lastSeq) {
            $num = (int) Str::afterLast($lastSeq, '-');
            $next = $num + 1;
        }

        return $prefix . str_pad($next, 2, '0', STR_PAD_LEFT);
    }

    private static function detectCategory(string $name): string
    {
        $n = Str::lower($name);

        return match (true) {
            Str::contains($n, ['yarn', 'benang']) => 'YRN',
            Str::contains($n, ['fabric', 'kain', 'greige']) => 'FAB',
            Str::contains($n, ['dye', 'chemical', 'softener', 'kimia']) => 'CHM',
            Str::contains($n, ['box', 'carton', 'polybag', 'pack']) => 'PCK',
            default => 'GEN',
        };
    }

    private static function makeShortName(string $name): string
    {
        // Ambil token penting (huruf+angka), buang kata umum
        $stop = ['yarn','fabric','kain','chemical','dye','box','carton','polybag','pack'];
        $tokens = collect(preg_split('/\s+/', Str::upper($name)))
            ->map(fn ($t) => preg_replace('/[^A-Z0-9]/', '', $t))
            ->filter(fn ($t) => $t && !in_array(Str::lower($t), $stop))
            ->values();

        // Gabungkan maksimal 2 token pertama agar pendek
        return $tokens->take(2)->implode('');
    }
}
