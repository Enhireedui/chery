import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase";

/* ══════════════════════════════════════════════════════════════
   ЛИД ХҮЛЭЭН АВАХ — `LeadModal` ба `BookingForm` хоёулаа энд илгээнэ.

   Хоёр төрлийн хариу (`Accept` толгойгоор):
     · `site.js` (fetch, `Accept: application/json`) → JSON
       { ok: true } | { ok: false, error: "validation" | "rate" | "config" | "server" }
     · JS-гүй энгийн маягт → 303 redirect: амжилттай бол `/thanks`,
       алдаа гарвал буцаад `/contact#захиалга`.

   Хамгаалалт (DB-ийн `check` хязгаарлалтын ӨМНӨХ давхарга):
     · honeypot `company` бөглөгдсөн бол чимээгүй «амжилттай» гэнэ
     · IP тутамд 10 минутад 5 илгээлт (instance-ийн санах ойд)
     · ижил утас 10 минутад дахин ирвэл шинэ мөр үүсгэхгүй, амжилттай
       гэж хариулна — давхар дарсан хэрэглэгчийг алдаагаар айлгахгүй
   ══════════════════════════════════════════════════════════════ */

const MODELS = new Set(["tiggo-2", "tiggo-4", "tiggo-7", "tiggo-8"]);
const PURPOSES = new Set(["test-drive", "quote", "advice"]);

/* Монгол гар утас: 8 оронтой, 5–9-өөр эхэлнэ. +976 угтварыг хасна. */
const MN_MOBILE = /^[5-9]\d{7}$/;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, ts] of hits) if (ts.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_MAX;
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 8 && digits.startsWith("976") ? digits.slice(3) : digits;
}

function field(form: FormData, name: string, max: number): string {
  const v = form.get(name);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Referer-ээс зөвхөн өөрийн сайтын замыг авна. */
function sourcePath(req: NextRequest, fromForm: string): string | null {
  if (fromForm.startsWith("/")) return fromForm.slice(0, 300);
  const ref = req.headers.get("referer");
  if (!ref) return null;
  try {
    const url = new URL(ref);
    return url.host === req.nextUrl.host ? decodeURI(url.pathname).slice(0, 300) : null;
  } catch {
    return null;
  }
}

type LeadError = "validation" | "rate" | "config" | "server";

export async function POST(req: NextRequest) {
  const wantsJson = (req.headers.get("accept") ?? "").includes("application/json");

  const reply = (error: LeadError | null, status: number) => {
    if (wantsJson) {
      return NextResponse.json(error ? { ok: false, error } : { ok: true }, { status });
    }
    const to = error ? "/contact#захиалга" : "/thanks";
    return NextResponse.redirect(new URL(to, req.url), 303);
  };

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return reply("validation", 400);
  }

  // Бот — чимээгүй «амжилттай».
  if (field(form, "company", 200)) return reply(null, 200);

  const now = Date.now();
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, now)) return reply("rate", 429);

  const name = field(form, "name", 120);
  const phone = normalizePhone(field(form, "phone", 32));
  const email = field(form, "email", 200);
  const modelRaw = field(form, "model", 20);
  const purposeRaw = field(form, "purpose", 20);

  if (!name || !MN_MOBILE.test(phone)) return reply("validation", 422);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply("validation", 422);

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("lead: Supabase тохируулаагүй (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
    return reply("config", 503);
  }

  // Давхар илгээлт: ижил утас сүүлийн 10 минутад бүртгэгдсэн бол дахин бичихгүй.
  const since = new Date(now - RATE_WINDOW_MS).toISOString();
  const { data: dupe, error: dupeError } = await supabase
    .from("leads")
    .select("id")
    .eq("phone", phone)
    .gte("created_at", since)
    .limit(1);
  if (dupeError) console.error("lead: duplicate check failed", dupeError.message);
  if (dupe && dupe.length > 0) return reply(null, 200);

  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    model: MODELS.has(modelRaw) ? modelRaw : null,
    purpose: PURPOSES.has(purposeRaw) ? purposeRaw : "test-drive",
    // Хүснэгтэд имэйлийн багана байхгүй — миграцгүйгээр message-д хадгална.
    message: email ? `Имэйл: ${email}` : null,
    source_path: sourcePath(req, field(form, "source_path", 300)),
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 400) || null,
  });

  if (error) {
    console.error("lead: insert failed", error.message);
    return reply("server", 500);
  }
  return reply(null, 200);
}
