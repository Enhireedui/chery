import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ══════════════════════════════════════════════════════════════
   Supabase — ЗӨВХӨН СЕРВЕР ДЭЭР (Phase 4, 20)

   ⚠ ЭНЭ ФАЙЛЫГ CLIENT COMPONENT-Д ИМПОРТЛОХГҮЙ.
   `SUPABASE_SERVICE_ROLE_KEY` нь RLS-ийг БҮТНЭЭР ДАВДАГ — хөтөч
   рүү хүрвэл `leads` хүснэгтийг хэн ч уншиж, засаж, устгаж чадна.
   Тэр нь `NEXT_PUBLIC_` угтваргүй тул Next.js түүнийг client
   bundle-д ОГТ оруулахгүй. Доорх `server-only` шалгалт нь
   алдаатай импортыг build/runtime дээр шууд барина.

   Яагаад anon key биш service key вэ: `leads` хүснэгтийн RLS нь
   ямар ч public хандалт зөвшөөрөхгүй (SELECT ч, INSERT ч).
   Бичих эрх нь зөвхөн сервер дээр байх нь Phase 5-ийн
   «least-privilege» ба «private data must never be publicly
   queryable» шаардлагыг биелүүлнэ. Хэрэв anon key-ээр INSERT
   зөвшөөрвөл дурын хүн шууд хүснэгт рүү хүсэлт бөмбөгдөж
   чадна — сервер дээрх валидац, rate limit тойрч гарна.
   ══════════════════════════════════════════════════════════════ */

if (typeof window !== "undefined") {
  throw new Error(
    "lib/supabase.ts нь зөвхөн серверт зориулагдсан. Client component-д импортлохгүй."
  );
}

let cached: SupabaseClient | null = null;

/** Сервер дээрх Supabase клиент. Тохиргоо байхгүй бол `null`.
 *  `null` эргэвэл дуудагч нь 503-аар зөв хариулах ёстой —
 *  тохиргоогүй үед үйл ажиллагаа ЧИМЭЭГҮЙ БҮТЭЛГҮЙТЭХГҮЙ. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "chery-mn" } },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}
