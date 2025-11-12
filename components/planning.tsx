"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import BlurEffect from "react-progressive-blur";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";


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

function parseTimeToHHmm(ts: string) {
    // Ensure parseable format for Safari/iOS by replacing space with 'T'
    const iso = ts.replace(" ", "T");
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
}

function getDayOfWeek(ts: string): string {
    const iso = ts.replace(" ", "T");
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[d.getDay()];
}

function getDateFromTimestamp(ts: string): string {
    const iso = ts.replace(" ", "T");
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function groupActivitiesByDay(activities: Activity[]): { [key: string]: Activity[] } {
    const groups: { [key: string]: Activity[] } = {};

    activities.forEach(activity => {
        const day = getDayOfWeek(activity.start_timestamp);
        const date = getDateFromTimestamp(activity.start_timestamp);
        const key = `${day} ${date}`;

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(activity);
    });

    return groups;
}

function groupActivitiesByTimeSlot(activities: Activity[]): { [timeSlot: string]: Activity[] } {
    const timeGroups: { [timeSlot: string]: Activity[] } = {};

    activities.forEach(activity => {
        const time = parseTimeToHHmm(activity.start_timestamp);

        if (!timeGroups[time]) {
            timeGroups[time] = [];
        }
        timeGroups[time].push(activity);
    });

    return timeGroups;
}

export const works = [
    {
        artist: "Ornella Binni",
        art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Tom Byrom",
        art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Vladimir Malyavko",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
]


function parseTimestamp(ts: string): Date | null {
    const iso = ts.replace(" ", "T");
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date;
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

    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startLabel = startCopy.toLocaleDateString("fr-FR", options);
    const endLabel = endOfWeek.toLocaleDateString("fr-FR", options);

    return `Semaine du ${startLabel} au ${endLabel}`;
}

export default function Planning({ data }: { data: PlanningResponse }) {
    const [filter, setFilter] = useState("Tous");
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [isDesktop, setIsDesktop] = useState(true);


    const filters = useMemo(() => {
        const names = Array.from(new Set(data.data.activities_calendar.map(a => a.name_activity)));
        return ["Tous", ...names];
    }, [data.data.activities_calendar]);

    const filtered = useMemo(() => {
        if (filter === "Tous") return data.data.activities_calendar;
        return data.data.activities_calendar.filter(a => a.name_activity === filter);
    }, [data.data.activities_calendar, filter]);

    const weeks = useMemo(() => {
        const weekMap = new Map<string, { start: Date; activities: Activity[] }>();

        const sortedActivities = [...filtered].sort((a, b) => {
            const dateA = parseTimestamp(a.start_timestamp);
            const dateB = parseTimestamp(b.start_timestamp);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        });

        sortedActivities.forEach(activity => {
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
            .map(group => ({
                key: group.start.toISOString(),
                label: formatWeekRange(group.start),
                activities: group.activities,
            }));
    }, [filtered]);

    useEffect(() => {
        setCurrentWeekIndex(0);
        setExpanded(false);
    }, [filter]);

    useEffect(() => {
        setCurrentWeekIndex(prev => {
            if (weeks.length === 0) return 0;
            return Math.min(prev, weeks.length - 1);
        });
    }, [weeks.length]);

    const currentWeek = weeks[currentWeekIndex] ?? null;
    const currentWeekActivities = currentWeek?.activities ?? [];

    const groupedActivities = useMemo(() => {
        return groupActivitiesByDay(currentWeekActivities);
    }, [currentWeekActivities]);

    const groupedByDayAndTime = useMemo(() => {
        const result: { [dayKey: string]: { [timeSlot: string]: Activity[] } } = {};

        Object.entries(groupedActivities).forEach(([dayKey, dayActivities]) => {
            result[dayKey] = groupActivitiesByTimeSlot(dayActivities);
        });

        return result;
    }, [groupedActivities]);

    const canGoPrev = currentWeekIndex > 0;
    const canGoNext = currentWeekIndex < weeks.length - 1;

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(min-width: 1024px)");

        const updateMatch = () => setIsDesktop(mediaQuery.matches);
        updateMatch();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", updateMatch);
            return () => mediaQuery.removeEventListener("change", updateMatch);
        }

        mediaQuery.addListener(updateMatch);
        return () => mediaQuery.removeListener(updateMatch);
    }, []);

    useEffect(() => {
        const node = contentRef.current;
        if (!node) return;

        const updateHeight = () => {
            const nextHeight = node.scrollHeight;
            setContentHeight(prev => (prev !== nextHeight ? nextHeight : prev));
        };

        updateHeight();

        if (typeof window === "undefined" || !("ResizeObserver" in window)) {
            return;
        }

        const observer = new window.ResizeObserver(() => {
            updateHeight();
        });

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [groupedByDayAndTime]);

    const toggleThreshold = isDesktop ? 600 : 400;
    const showToggle = contentHeight > toggleThreshold;
    const collapsedHeight = showToggle ? toggleThreshold : contentHeight;
    const dayCount = Object.keys(groupedByDayAndTime).length;

    return (
        <section id="planning" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <h2 className="text-3xl font-bold">Planning de la semaine</h2>
                    <p className="mt-1 text-white/70">Filtrez par activité et réservez votre prochaine séance.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">Filtrer:</span>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Sélectionner une activité" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/10">
                                {filters.map((activity) => (
                                    <SelectItem
                                        key={activity}
                                        value={activity}
                                        className="text-white  hover:bg-white/10 focus:bg-white/10 focus:text-white"
                                    >
                                        {activity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {weeks.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full border border-white/10 text-white hover:bg-white/10"
                                onClick={() => setCurrentWeekIndex(prev => Math.max(0, prev - 1))}
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
                                onClick={() => setCurrentWeekIndex(prev => Math.min(weeks.length - 1, prev + 1))}
                                disabled={!canGoNext}
                                aria-label="Semaine suivante"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div
                        className={`transition-[max-height] duration-500 ease-in-out ${showToggle && !expanded ? "overflow-y-hidden" : ""}`}
                        style={showToggle ? { maxHeight: expanded ? contentHeight : collapsedHeight } : undefined}
                    >
                        <div ref={contentRef}>
                            {weeks.length === 0 && (
                                <div className="py-16 text-center text-white/70">
                                    Aucune activité disponible pour le moment.
                                </div>
                            )}
                            {weeks.length > 0 && dayCount === 0 && (
                                <div className="py-16 text-center text-white/70">
                                    Aucune activité prévue pour cette semaine.
                                </div>
                            )}
                            {/* Desktop: Column layout */}
                            <div className={dayCount > 0 ? "hidden lg:block" : "hidden"}>
                                <ScrollArea className="whitespace-nowrap overflow-x-hidden">
                                    <div
                                        className="grid gap-4 w-max"
                                        style={{ gridTemplateColumns: `repeat(${Math.max(dayCount, 1)}, minmax(280px, 1fr))` }}
                                    >
                                        {Object.entries(groupedByDayAndTime).map(([dayDate, timeSlots]) => (
                                            <div key={dayDate} className="space-y-4 min-w-0">
                                                <h3 className="text-lg font-semibold text-white text-center sticky top-0 bg-black/90 backdrop-blur-sm py-3 rounded-lg border border-white/10">{dayDate}</h3>
                                                <div className="space-y-4">
                                                    {Object.entries(timeSlots).map(([timeSlot, timeActivities]) => (
                                                        <div key={timeSlot} className="space-y-2">
                                                            <div className="text-xl font-semibold text-white/80 text-center">{timeSlot}</div>
                                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                                {timeActivities.map((a) => {
                                                                    const cardStyle = a.color
                                                                        ? {
                                                                            backgroundColor: `${a.color}22`,
                                                                            borderColor: a.color,
                                                                            color: a.color,
                                                                        }
                                                                        : undefined;
                                                                    return (
                                                                        <div
                                                                            key={a.id_activity_calendar}
                                                                            className="flex-shrink-0 w-48 rounded-xl border p-3 text-center transition hover:bg-white/10 flex items-center justify-center"
                                                                            style={cardStyle}
                                                                        >
                                                                            <div className="text-sm font-semibold truncate">
                                                                                {a.name_activity}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>

                            {/* Mobile/Tablet: Row layout */}
                            <div className={`space-y-8 ${dayCount > 0 ? "lg:hidden" : "hidden"}`}>
                                {Object.entries(groupedByDayAndTime).map(([dayDate, timeSlots]) => (
                                    <div key={dayDate}>
                                        <h3 className="text-xl font-semibold text-white mb-4">{dayDate}</h3>
                                        <div className="space-y-6">
                                            {Object.entries(timeSlots).map(([timeSlot, timeActivities]) => (
                                                <div key={timeSlot} className="space-y-3">
                                                    <div className="text-xl font-semibold text-white/80">{timeSlot}</div>
                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {timeActivities.map((a) => {
                                                            const cardStyle = a.color
                                                                ? {
                                                                    backgroundColor: `${a.color}22`,
                                                                    borderColor: a.color,
                                                                    color: a.color,
                                                                }
                                                                : undefined;
                                                            return (
                                                                <div
                                                                    key={a.id_activity_calendar}
                                                                    className="rounded-xl border p-3 text-center transition hover:bg-white/10 flex items-center justify-center"
                                                                    style={cardStyle}
                                                                >
                                                                    <div className="text-sm font-semibold truncate">
                                                                        {a.name_activity}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {showToggle && !expanded && (
                        <BlurEffect position="bottom" intensity={80} className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0F12] via-[#0B0F12]/60 to-transparent" />
                    )}
                </div>
                {showToggle && (
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            className="rounded-xl bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                            onClick={() => setExpanded(prev => !prev)}
                            aria-expanded={expanded}
                        >
                            {expanded ? "Voir moins" : "Voir plus"}
                        </button>
                    </div>
                )}
            </div>

        </section >
    )

}