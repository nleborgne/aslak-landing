"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Activity = {
  id_activity_calendar: number;
  name_activity: string;
  description: string | null;
  start_timestamp: string; // e.g. "2025-09-19 13:00:00"
  end_timestamp: string;
  n_inscribed: number;
  n_capacity: number;
  color?: string | null;
};

type PlanningResponse = {
  message: string;
  data: {
    activities_calendar: Activity[];
  };
  success: boolean;
  status: number;
};

const SHORT_DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const FULL_DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

function parseTimestamp(ts: string): Date | null {
  // Replace space with 'T' for Safari/iOS parsing
  const date = new Date(ts.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function parseTimeToHHmm(ts: string): string {
  const d = parseTimestamp(ts);
  if (!d) return "";
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function dayKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getStartOfWeek(date: Date): Date {
  const weekDate = new Date(date);
  const day = (weekDate.getDay() + 6) % 7; // Monday as first day of week
  weekDate.setHours(0, 0, 0, 0);
  weekDate.setDate(weekDate.getDate() - day);
  return weekDate;
}

function formatWeekRange(start: Date): string {
  const startCopy = new Date(start);
  const endOfWeek = new Date(startCopy);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const startLabel = startCopy.toLocaleDateString("fr-FR", options);
  const endLabel = endOfWeek.toLocaleDateString("fr-FR", options);

  return `Semaine du ${startLabel} au ${endLabel}`;
}

type DayGroup = {
  key: string;
  date: Date;
  shortLabel: string; // "Mer"
  dayNum: string; // "18"
  fullLabel: string; // "Mercredi 18/06"
  activities: Activity[]; // sorted chronologically
};

export default function Planning({ data }: { data: PlanningResponse }) {
  const [filter, setFilter] = useState("Tous");
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const filters = useMemo(() => {
    const names = Array.from(
      new Set(data.data.activities_calendar.map((a) => a.name_activity))
    );
    return ["Tous", ...names];
  }, [data.data.activities_calendar]);

  // Weeks are built from ALL activities so the day navigator stays stable
  // regardless of the active activity filter (which only refines the day list).
  const weeks = useMemo(() => {
    const weekMap = new Map<string, { start: Date; activities: Activity[] }>();

    data.data.activities_calendar.forEach((activity) => {
      const startDate = parseTimestamp(activity.start_timestamp);
      if (!startDate) return;
      const weekStart = getStartOfWeek(startDate);
      const key = weekStart.toISOString();

      const entry = weekMap.get(key);
      if (entry) {
        entry.activities.push(activity);
      } else {
        weekMap.set(key, { start: weekStart, activities: [activity] });
      }
    });

    return Array.from(weekMap.values())
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .map((group) => ({
        key: group.start.toISOString(),
        label: formatWeekRange(group.start),
        activities: group.activities,
      }));
  }, [data.data.activities_calendar]);

  const currentWeek = weeks[currentWeekIndex] ?? null;
  const currentWeekActivities = currentWeek?.activities ?? [];

  // Days that actually have classes (closed days never appear -> "hide empty days").
  const days = useMemo<DayGroup[]>(() => {
    const map = new Map<string, { date: Date; activities: Activity[] }>();

    currentWeekActivities.forEach((a) => {
      const d = parseTimestamp(a.start_timestamp);
      if (!d) return;
      const key = dayKeyFromDate(d);
      const g = map.get(key);
      if (g) {
        g.activities.push(a);
      } else {
        map.set(key, { date: d, activities: [a] });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((g) => {
        const dd = g.date.getDate().toString().padStart(2, "0");
        const mm = (g.date.getMonth() + 1).toString().padStart(2, "0");
        return {
          key: dayKeyFromDate(g.date),
          date: g.date,
          shortLabel: SHORT_DAYS[g.date.getDay()],
          dayNum: dd,
          fullLabel: `${FULL_DAYS[g.date.getDay()]} ${dd}/${mm}`,
          activities: [...g.activities].sort((x, y) => {
            const dx = parseTimestamp(x.start_timestamp);
            const dy = parseTimestamp(y.start_timestamp);
            return (dx?.getTime() ?? 0) - (dy?.getTime() ?? 0);
          }),
        };
      });
  }, [currentWeekActivities]);

  const activeDay = days.find((d) => d.key === selectedDayKey) ?? days[0] ?? null;

  const dayList = useMemo(() => {
    if (!activeDay) return [];
    if (filter === "Tous") return activeDay.activities;
    return activeDay.activities.filter((a) => a.name_activity === filter);
  }, [activeDay, filter]);

  const canGoPrev = currentWeekIndex > 0;
  const canGoNext = currentWeekIndex < weeks.length - 1;

  // On mount, land on the week containing today (falls back to the first week).
  useEffect(() => {
    const todayWeekKey = getStartOfWeek(new Date()).toISOString();
    const idx = weeks.findIndex((w) => w.key === todayWeekKey);
    setCurrentWeekIndex(idx >= 0 ? idx : 0);
  }, [weeks]);

  // Default the visible day to today when present, else the first day of the week.
  useEffect(() => {
    if (days.length === 0) {
      setSelectedDayKey(null);
      return;
    }
    setSelectedDayKey((prev) => {
      if (prev && days.some((d) => d.key === prev)) return prev;
      const todayKey = dayKeyFromDate(new Date());
      return days.some((d) => d.key === todayKey) ? todayKey : days[0].key;
    });
  }, [days]);

  return (
    <section id="planning" className="py-20">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">Planning de la semaine</h2>
          <p className="mt-1 text-white/70">
            Retrouvez les cours du jour en un coup d&apos;œil.
          </p>
        </div>
        {weeks.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-white/10 text-white hover:bg-white/10"
              onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
              disabled={!canGoPrev}
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-white/80 text-sm sm:text-base font-medium text-center min-w-[180px]">
              {currentWeek?.label ?? ""}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-white/10 text-white hover:bg-white/10"
              onClick={() =>
                setCurrentWeekIndex((prev) =>
                  Math.min(weeks.length - 1, prev + 1)
                )
              }
              disabled={!canGoNext}
              aria-label="Semaine suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {weeks.length === 0 || days.length === 0 ? (
        <div className="mt-10 py-16 text-center text-white/70">
          Aucune activité disponible pour le moment.
        </div>
      ) : (
        <>
          {/* ===== Day navigator (segmented pills) ===== */}
          <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl bg-white/5 p-1.5 ring-1 ring-white/10">
            {days.map((d) => {
              const active = d.key === activeDay?.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDayKey(d.key)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="capitalize">{d.shortLabel}</span> {d.dayNum}
                </button>
              );
            })}
          </div>

          {/* ===== Activity filter chips (shared) ===== */}
          <ScrollArea orientation="horizontal" className="mt-6 w-full">
            <div className="flex w-max gap-2 pb-3">
              {filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      active
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* ===== Selected day list (shared, flat chronological) ===== */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold capitalize">
              {activeDay?.fullLabel}
            </h3>
            <div className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
              {dayList.length === 0 ? (
                <div className="px-4 py-10 text-center text-white/60">
                  Aucun cours pour ce filtre ce jour.
                </div>
              ) : (
                dayList.map((a) => (
                  <div
                    key={a.id_activity_calendar}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    <span className="w-14 shrink-0 font-semibold tabular-nums text-white">
                      {parseTimeToHHmm(a.start_timestamp)}
                    </span>
                    <span className="flex-1 truncate text-white/90">
                      {a.name_activity}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-white/50">
                      {a.n_inscribed}/{a.n_capacity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
