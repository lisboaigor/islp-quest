import { loadState, saveState } from "@/lib/db";
import { sanitize } from "@/lib/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bloqueia escrita vinda de outros sites (o app roda em localhost e não tem login). */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  return !origin || new URL(origin).host === req.headers.get("host");
}

export async function GET() {
  return Response.json(loadState(), { headers: { "Cache-Control": "no-store" } });
}

async function write(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "origem não permitida" }, { status: 403 });
  let body: unknown;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  let state;
  try {
    state = sanitize(body);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
  saveState(state);
  return Response.json({ ok: true });
}

export const PUT = write;
export const POST = write; // sendBeacon só envia POST
