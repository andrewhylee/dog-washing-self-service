"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type RecordItem,
  dateParts,
  filterRecords,
  normalizeRecord,
  pickList,
  publicIdFromUrl,
  sortRecords,
} from "./records";

function DbIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function PlaceholderThumb() {
  return (
    <span className="thumb-placeholder" role="img" aria-label="No image">
      No image
    </span>
  );
}

function Thumb({ item }: { item: RecordItem }) {
  const [failed, setFailed] = useState(false);
  if (!item.url || failed) return <PlaceholderThumb />;
  return (
    <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.pet || "vaccine"} card`}>
      <img
        className="thumb"
        src={item.url}
        alt={item.pet ? `${item.pet} vaccine card` : "Vaccine card"}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </a>
  );
}

function ShimmerBar({ width, height, radius }: { width: string; height: string; radius?: string }) {
  return (
    <span className="sk" style={{ width, height, ...(radius ? { borderRadius: radius } : {}) }} />
  );
}

function skeletonRows(count: number) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push(
      <tr className="skeleton" key={i}>
        <td>
          <div className="pet-cell">
            <ShimmerBar width="76px" height="54px" radius="8px" />
            <span style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <ShimmerBar width="88px" height="13px" />
              <ShimmerBar width="60px" height="11px" />
            </span>
          </div>
        </td>
        <td>
          <ShimmerBar width="110px" height="13px" />
        </td>
        <td>
          <ShimmerBar width="170px" height="13px" />
        </td>
        <td>
          <ShimmerBar width="150px" height="13px" />
        </td>
        <td>
          <ShimmerBar width="95px" height="13px" />
        </td>
        <td className="actions-col">
          <div className="actions-wrap">
            <ShimmerBar width="64px" height="13px" />
          </div>
        </td>
      </tr>
    );
  }
  return rows;
}

export default function Dashboard() {
  const [all, setAll] = useState<RecordItem[]>([]);
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"ascending" | "descending">("descending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("api/vaccine-records");
      if (res.status === 401 || res.status === 403) {
        setError("Your session expired — reload the page to re-enter the password.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = (await res.json()) as unknown;
      setAll(sortRecords(pickList(payload).map(normalizeRecord), sortDir));
    } catch (err) {
      setError(`Couldn’t load records (${err instanceof Error ? err.message : "unknown error"}). Check your connection and hit Refresh.`);
    } finally {
      setLoading(false);
    }
  }, [sortDir]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim();
    return sortRecords(filterRecords(all, needle), sortDir);
  }, [all, query, sortDir]);

  const toggleSort = useCallback(() => {
    setSortDir((prev) => (prev === "descending" ? "ascending" : "descending"));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSort();
      }
    },
    [toggleSort]
  );

  const deleteRecord = useCallback(
    async (item: RecordItem) => {
      const label = [];
      if (item.pet) label.push(item.pet);
      if (item.owner) label.push(`(${item.owner})`);
      const who = label.length ? ` for ${label.join(" ")}` : "";
      if (!window.confirm(`Delete this vaccination record${who}, including its stored photo? This cannot be undone.`)) return;
      setDeleting(item.id);
      try {
        // Remove the Cloudinary photo first (best effort: unparseable URLs and
        // already-gone photos simply skip this step).
        const publicId = publicIdFromUrl(item.url);
        if (publicId) {
          try {
            await fetch(`api/vaccine-photo/${encodeURIComponent(publicId)}`, { method: "DELETE" });
          } catch {
            // Photo deletion is best effort; the record delete below still runs.
          }
        }
        const res = await fetch(`api/vaccine-records/${encodeURIComponent(item.id)}`, { method: "DELETE" });
        if (res.status === 401 || res.status === 403) {
          setError("Delete denied — reload the page and try again.");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await refresh();
      } catch {
        setError("Delete failed — check your connection and try again.");
      } finally {
        setDeleting(null);
      }
    },
    [refresh]
  );

  const showSkeleton = loading;
  const showError = !loading && error != null;
  const showEmpty = !loading && !error && all.length === 0;
  const showEmptySearch = !loading && !error && all.length > 0 && filtered.length === 0;
  const showRows = !loading && !error && filtered.length > 0;

  let countLabel = "";
  if (!loading && !error) {
    if (all.length > 0) {
      if (filtered.length === 0) {
        countLabel = `0 of ${all.length} ${all.length === 1 ? "record" : "records"}`;
      } else {
        countLabel = `${filtered.length} of ${all.length} ${all.length === 1 ? "record" : "records"}`;
      }
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <DbIcon />
            </span>
            <div>
              <div className="brand-name">Fresh Paws</div>
              <div className="brand-sub">Admin · Vaccine records</div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="owner-badge">Owner view</span>
            <button className="btn" type="button" onClick={load} disabled={loading}>
              <RefreshIcon className="ico" />
              <span className="btn-label">{loading ? "Loading…" : "Refresh"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="page-head">
          <div>
            <h1>Vaccination records</h1>
            <p className="page-desc">
              Search by owner, pet, phone, or email. Click “Uploaded” to change the sort order.
            </p>
          </div>
        </div>

        <section className="card">
          <div className="toolbar">
            <div className="search">
              <SearchIcon className="ico" />
              <input
                type="search"
                placeholder="Search owner, pet, phone, or email…"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="toolbar-right">
              <span className="count" role="status">
                {countLabel}
              </span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  <th scope="col">Pet</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Contact</th>
                  <th
                    scope="col"
                    className="sortable"
                    tabIndex={0}
                    aria-sort={sortDir}
                    onClick={toggleSort}
                    onKeyDown={handleKeyDown}
                  >
                    Uploaded <span className="arrow" aria-hidden="true" />
                  </th>
                  <th scope="col">Card</th>
                  <th scope="col" className="actions-col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody aria-live="polite">
                {showSkeleton && skeletonRows(3)}
                {showRows &&
                  filtered.map((item) => {
                    const { date, time } = dateParts(item.ts);
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="pet-cell">
                            <Thumb item={item} />
                            <div>
                              <div className="pet-name">{item.pet || "Unnamed pup"}</div>
                              {item.file && <div className="pet-file">{item.file}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="owner-cell">{item.owner || "—"}</td>
                        <td className="contact-cell">
                          <span className="row phone">{item.phone || "—"}</span>
                          <span className="row">{item.email || "—"}</span>
                        </td>
                        <td className="date-cell">
                          {item.ts ? (
                            <>
                              <span>{date}</span>
                              <span className="ts">{time}</span>
                            </>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <td>
                          {item.url ? (
                            <a className="open-link" href={item.url} target="_blank" rel="noreferrer">
                              <ExternalIcon className="ico" />
                              Open card
                            </a>
                          ) : (
                            <span className="open-link">—</span>
                          )}
                        </td>
                        <td className="actions-col">
                          <div className="actions-wrap">
                            <button
                              className="del-btn"
                              type="button"
                              onClick={() => void deleteRecord(item)}
                              disabled={deleting === item.id}
                            >
                              <TrashIcon className="ico" />
                              {deleting === item.id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="state-box empty" hidden={!showEmpty}>
              No vaccine records yet. New submissions from the vaccination form will appear here.
            </div>
            {showEmptySearch && (
              <div className="state-box empty">
                No records match “{query.trim()}”.
              </div>
            )}
            {showError && <div className="state-box note">{error}</div>}
          </div>
        </section>

        <p className="footnote">Fresh Paws Dog Wash · Sunnyside, Queens · private owner dashboard</p>
      </main>
    </>
  );
}