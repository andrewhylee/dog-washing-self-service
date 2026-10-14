export type RawRecord = Record<string, unknown>;

export type RecordItem = {
  id: string;
  pet: string;
  owner: string;
  phone: string;
  email: string;
  file: string;
  url: string;
  ts: number;
};

/** Extract a Cloudinary public_id from a delivery URL (version + extension stripped). */
export function publicIdFromUrl(url: string): string {
  const m = /\/upload\/(.+)$/.exec(url || "");
  if (!m) return "";
  const parts = m[1].split("/").filter(Boolean);
  const vIdx = parts.findIndex((p) => /^v\d+$/.test(p));
  const tail = vIdx >= 0 ? parts.slice(vIdx + 1) : parts;
  if (tail.length === 0) return "";
  const last = tail[tail.length - 1].replace(/\.[^.]+$/, "");
  const id = [...tail.slice(0, -1), last].filter(Boolean).join("/");
  if (!id || id.includes("..")) return "";
  return id;
}

export function pickList(payload: unknown): RawRecord[] {
  if (Array.isArray(payload)) return payload as RawRecord[];
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  for (const key of ["data", "records", "entries"]) {
    const v = p[key];
    if (Array.isArray(v)) return v as RawRecord[];
  }
  return [];
}

function nestedData(r: RawRecord): Record<string, unknown> {
  const data = r.data;
  return data && typeof data === "object" ? (data as Record<string, unknown>) : r;
}

export function parseTs(r: RawRecord): number {
  const d = nestedData(r);
  const candidates = [d.uploaded_at, d.created_at, d.updated_at, r.created_at, r.updated_at];
  for (const c of candidates) {
    if (c == null || c === "") continue;
    const ms = new Date(c as string).getTime();
    if (isFinite(ms) && ms > 0) return ms;
  }
  return 0;
}

export function normalizeRecord(r: RawRecord): RecordItem {
  const d = nestedData(r);
  const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
  return {
    id: str(d.id || r.id),
    pet: str(d.pet_name),
    owner: [str(d.first_name), str(d.last_name)].filter(Boolean).join(" "),
    phone: str(d.phone),
    email: str(d.email),
    file: str(d.file_name),
    url: str(d.card_url),
    ts: parseTs(r),
  };
}

export function filterRecords(list: RecordItem[], q: string): RecordItem[] {
  const needle = (q || "").trim().toLowerCase();
  if (!needle) return list.slice();
  return list.filter((n) =>
    [n.owner, n.pet, n.phone, n.email].join(" ").toLowerCase().includes(needle)
  );
}

export function sortRecords(list: RecordItem[], dir: "ascending" | "descending"): RecordItem[] {
  const sign = dir === "ascending" ? 1 : -1;
  return list.slice().sort((a, b) => (a.ts - b.ts) * sign || a.id.localeCompare(b.id));
}

export function dateParts(ms: number): { date: string; time: string } {
  if (!ms) return { date: "", time: "" };
  const d = new Date(ms);
  return {
    date: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}