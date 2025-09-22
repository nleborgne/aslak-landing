"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronLeft, ChevronRight, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
    id_activity_calendar: number
    name_activity: string
    description: string
    start_timestamp: string
    end_timestamp: string
    n_inscribed: number
    n_capacity: number
    color: string
    guest_info: {
        price: number
        can_join: boolean
        user_attending: boolean
    }
}

interface TimetableData {
    data: {
        activities_calendar: Activity[]
    }
}

interface WeeklyTimetableProps {
    data: TimetableData
}

const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6 // Start from 6 AM
    return `${hour.toString().padStart(2, "0")}:00`
})

function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
}

function formatDate(date: Date): string {
    return date.toISOString().split("T")[0]
}

function parseTimestamp(timestamp: string): Date {
    return new Date(timestamp.replace(" ", "T"))
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "")
}

export function WeeklyTimetable({ data }: WeeklyTimetableProps) {
    const [currentWeek, setCurrentWeek] = useState(new Date())

    const weekStart = useMemo(() => getWeekStart(currentWeek), [currentWeek])
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + i)
            return date
        })
    }, [weekStart])

    const weekActivities = useMemo(() => {
        const weekStartStr = formatDate(weekStart)
        const weekEndDate = new Date(weekStart)
        weekEndDate.setDate(weekStart.getDate() + 6)
        const weekEndStr = formatDate(weekEndDate)

        return data.data.activities_calendar.filter((activity) => {
            const activityDate = formatDate(parseTimestamp(activity.start_timestamp))
            return activityDate >= weekStartStr && activityDate <= weekEndStr
        })
    }, [data.data.activities_calendar, weekStart])

    const activitiesByDay = useMemo(() => {
        const grouped: { [key: string]: Activity[] } = {}

        weekDays.forEach((day) => {
            const dayStr = formatDate(day)
            grouped[dayStr] = weekActivities
                .filter((activity) => {
                    const activityDate = formatDate(parseTimestamp(activity.start_timestamp))
                    return activityDate === dayStr
                })
                .sort((a, b) => parseTimestamp(a.start_timestamp).getTime() - parseTimestamp(b.start_timestamp).getTime())
        })

        return grouped
    }, [weekActivities, weekDays])

    const hasActivitiesInWeek = (weekOffset: number): boolean => {
        const testWeek = new Date(currentWeek)
        testWeek.setDate(currentWeek.getDate() + weekOffset * 7)
        const testWeekStart = getWeekStart(testWeek)
        const testWeekStartStr = formatDate(testWeekStart)
        const testWeekEnd = new Date(testWeekStart)
        testWeekEnd.setDate(testWeekStart.getDate() + 6)
        const testWeekEndStr = formatDate(testWeekEnd)

        return data.data.activities_calendar.some((activity) => {
            const activityDate = formatDate(parseTimestamp(activity.start_timestamp))
            return activityDate >= testWeekStartStr && activityDate <= testWeekEndStr
        })
    }

    const navigateWeek = (direction: "prev" | "next") => {
        const newWeek = new Date(currentWeek)
        newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
        setCurrentWeek(newWeek)
    }

    const formatTime = (timestamp: string): string => {
        const date = parseTimestamp(timestamp)
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    const getActivityPosition = (activity: Activity, dayActivities: Activity[]) => {
        const startTime = parseTimestamp(activity.start_timestamp)
        const endTime = parseTimestamp(activity.end_timestamp)
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // Duration in minutes

        // Find overlapping activities
        const overlapping = dayActivities.filter((other) => {
            if (other.id_activity_calendar === activity.id_activity_calendar) return false
            const otherStart = parseTimestamp(other.start_timestamp)
            const otherEnd = parseTimestamp(other.end_timestamp)
            return startTime < otherEnd && endTime > otherStart
        })

        return {
            duration,
            overlapping: overlapping.length,
            index: dayActivities.findIndex((a) => a.id_activity_calendar === activity.id_activity_calendar),
        }
    }

    return (
        <div className="w-full space-y-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek("prev")}
                    disabled={!hasActivitiesInWeek(-1)}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Semaine précédente</span>
                </Button>

                <div className="text-center">
                    <h2 className="text-lg font-semibold">
                        {weekStart.toLocaleDateString("fr-FR", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}{" "}
                        -{" "}
                        {weekDays[6].toLocaleDateString("fr-FR", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </h2>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek("next")}
                    disabled={!hasActivitiesInWeek(1)}
                    className="flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Semaine suivante</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
                <div className="grid grid-cols-8 gap-2">
                    {/* Time column header */}
                    <div className="text-sm font-medium text-muted-foreground p-2">Heure</div>

                    {/* Day headers */}
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-center p-2">
                            <div className="text-sm font-medium">{DAYS_OF_WEEK[index]}</div>
                            <div className="text-xs text-muted-foreground">
                                {day.toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
                            </div>
                        </div>
                    ))}

                    {/* Time slots and activities */}
                    {TIME_SLOTS.map((timeSlot) => (
                        <div key={timeSlot} className="contents">
                            {/* Time label */}
                            <div className="text-xs text-muted-foreground p-2 border-r">{timeSlot}</div>

                            {/* Day columns */}
                            {weekDays.map((day, dayIndex) => {
                                const dayStr = formatDate(day)
                                const dayActivities = activitiesByDay[dayStr] || []
                                const slotActivities = dayActivities.filter((activity) => {
                                    const activityTime = formatTime(activity.start_timestamp)
                                    return activityTime.startsWith(timeSlot.split(":")[0])
                                })

                                return (
                                    <div key={dayIndex} className="min-h-[60px] border-r border-b p-1 relative">
                                        {slotActivities.map((activity) => {
                                            const position = getActivityPosition(activity, dayActivities)
                                            return (
                                                <Card
                                                    key={activity.id_activity_calendar}
                                                    className={cn(
                                                        "mb-1 cursor-pointer transition-all hover:shadow-md",
                                                        position.overlapping > 0 && "opacity-90",
                                                    )}
                                                    style={{
                                                        backgroundColor: activity.color + "20",
                                                        borderColor: activity.color,
                                                        minHeight: `${Math.max(40, position.duration / 2)}px`,
                                                    }}
                                                >
                                                    <CardContent className="p-2">
                                                        <div className="text-xs font-medium truncate">{activity.name_activity}</div>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <Users className="h-3 w-3" />
                                                            {activity.n_inscribed}/{activity.n_capacity}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                <Accordion type="multiple" className="w-full">
                    {weekDays.map((day, index) => {
                        const dayStr = formatDate(day)
                        const dayActivities = activitiesByDay[dayStr] || []

                        if (dayActivities.length === 0) return null

                        return (
                            <AccordionItem key={index} value={`day-${index}`} className="border rounded-lg mb-4">
                                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                    <div className="flex items-center justify-between w-full mr-4">
                                        <div className="text-left">
                                            <h2 className="text-lg font-semibold">{DAYS_OF_WEEK[index]}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {day.toLocaleDateString("fr-FR", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">
                                            {dayActivities.length} {dayActivities.length === 1 ? "activité" : "activités"}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                    <div className="space-y-3">
                                        {dayActivities.map((activity) => (
                                            <Card
                                                key={activity.id_activity_calendar}
                                                className="cursor-pointer transition-all hover:shadow-md"
                                                style={{
                                                    backgroundColor: activity.color + "10",
                                                    borderColor: activity.color,
                                                }}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-sm">{activity.name_activity}</h3>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatTime(activity.start_timestamp)} - {formatTime(activity.end_timestamp)}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="h-3 w-3" />
                                                                    {activity.n_inscribed}/{activity.n_capacity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {activity.guest_info.user_attending && (
                                                            <Badge className="ml-2" variant="default">
                                                                Inscrit
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>

            {weekActivities.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Aucune activité programmée pour cette semaine.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
