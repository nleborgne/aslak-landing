"use client"

import { useEffect, useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

export default function Planning({ data }: { data: PlanningResponse }) {
    const [filter, setFilter] = useState("Tous");


    const filters = useMemo(() => {
        const names = Array.from(new Set(data.data.activities_calendar.map(a => a.name_activity)));
        return ["Tous", ...names];
    }, [data.data.activities_calendar]);

    const filtered = useMemo(() => {
        if (filter === "Tous") return data.data.activities_calendar;
        return data.data.activities_calendar.filter(a => a.name_activity === filter);
    }, [data.data.activities_calendar, filter]);

    const groupedActivities = useMemo(() => {
        return groupActivitiesByDay(filtered);
    }, [filtered]);

    const groupedByDayAndTime = useMemo(() => {
        const result: { [dayKey: string]: { [timeSlot: string]: Activity[] } } = {};

        Object.entries(groupedActivities).forEach(([dayKey, dayActivities]) => {
            result[dayKey] = groupActivitiesByTimeSlot(dayActivities);
        });

        return result;
    }, [groupedActivities]);
    return (
        <section id="planning" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <h2 className="text-3xl font-bold">Live Planning</h2>
                    <p className="mt-1 text-white/70">Filtrez par activité et réservez votre prochaine séance.</p>
                </div>
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
            </div>


            <div className="mt-6">
                {/* Desktop: Column layout */}
                <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                        <div className="grid gap-4 min-w-max" style={{ gridTemplateColumns: `repeat(${Object.keys(groupedByDayAndTime).length}, minmax(280px, 1fr))` }}>
                            {Object.entries(groupedByDayAndTime).map(([dayDate, timeSlots]) => (
                                <div key={dayDate} className="space-y-4 min-w-0">
                                    <h3 className="text-lg font-semibold text-white text-center sticky top-0 bg-black/90 backdrop-blur-sm py-3 rounded-lg border border-white/10">{dayDate}</h3>
                                    <div className="space-y-4">
                                        {Object.entries(timeSlots).map(([timeSlot, timeActivities]) => (
                                            <div key={timeSlot} className="space-y-2">
                                                <div className="text-xl font-semibold text-white/80 text-center">{timeSlot}</div>
                                                <div className="flex gap-3 overflow-x-auto pb-2">
                                                    {timeActivities.map((a) => {
                                                        const remaining = Math.max(0, (a.n_capacity ?? 0) - (a.n_inscribed ?? 0));
                                                        const badgeStyle = a.color ? { backgroundColor: `${a.color}22`, color: a.color } : {} as any;
                                                        return (
                                                            <div key={a.id_activity_calendar} className="flex-shrink-0 w-64 group rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="rounded-full px-2 py-0.5 text-xs uppercase tracking-wide bg-white/10" style={badgeStyle}>{a.name_activity}</span>
                                                                </div>
                                                                {/* Optional: show short description without HTML tags */}
                                                                {/* <div className="mt-1 text-white/70 text-sm">{stripHtml(a.description || "")}</div> */}
                                                                <div className="mt-6 flex items-center justify-between">
                                                                    <div className="text-white/60 text-sm">{remaining} places restantes</div>
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

                {/* Mobile/Tablet: Row layout */}
                <div className="lg:hidden space-y-8">
                    {Object.entries(groupedByDayAndTime).map(([dayDate, timeSlots]) => (
                        <div key={dayDate}>
                            <h3 className="text-xl font-semibold text-white mb-4">{dayDate}</h3>
                            <div className="space-y-6">
                                {Object.entries(timeSlots).map(([timeSlot, timeActivities]) => (
                                    <div key={timeSlot} className="space-y-3">
                                        <div className="text-xl font-semibold text-white/80">{timeSlot}</div>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {timeActivities.map((a) => {
                                                const remaining = Math.max(0, (a.n_capacity ?? 0) - (a.n_inscribed ?? 0));
                                                const badgeStyle = a.color ? { backgroundColor: `${a.color}22`, color: a.color } : {} as any;
                                                return (
                                                    <div key={a.id_activity_calendar} className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition">
                                                        <div className="flex items-center justify-between">
                                                            <span className="rounded-full px-2 py-0.5 text-xs uppercase tracking-wide bg-white/10" style={badgeStyle}>{a.name_activity}</span>
                                                        </div>
                                                        {/* Optional: show short description without HTML tags */}
                                                        {/* <div className="mt-1 text-white/70 text-sm">{stripHtml(a.description || "")}</div> */}
                                                        <div className="mt-6 flex items-center justify-between">
                                                            <div className="text-white/60 text-sm">{remaining} places restantes</div>
                                                            <button className="rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-emerald-500/20 shadow-lg">Réserver</button>
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

        </section>
    )

}