"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function PlanningSkeleton() {
    const dayCount = 5; // Default skeleton shows 5 days
    const activitiesPerDay = 3; // Activities per time slot

    return (
        <section id="planning" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <Skeleton className="h-9 w-64 bg-white/10" />
                    <Skeleton className="mt-2 h-5 w-96 bg-white/10" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Filter Skeleton */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-12 bg-white/10" />
                        <Skeleton className="h-10 w-48 bg-white/5 border border-white/10" />
                    </div>
                    {/* Week Navigation Skeleton */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full bg-white/5 border border-white/10" />
                        <Skeleton className="h-6 w-[200px] bg-white/10" />
                        <Skeleton className="h-10 w-10 rounded-full bg-white/5 border border-white/10" />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="relative">
                    {/* Desktop: Column layout */}
                    <div className="hidden lg:block">
                        <ScrollArea className="whitespace-nowrap overflow-x-hidden">
                            <div
                                className="grid gap-4 w-max"
                                style={{ gridTemplateColumns: `repeat(${dayCount}, minmax(280px, 1fr))` }}
                            >
                                {Array.from({ length: dayCount }).map((_, dayIndex) => (
                                    <div key={dayIndex} className="space-y-4 min-w-0">
                                        {/* Day Header Skeleton */}
                                        <Skeleton className="h-12 w-full bg-white/10 rounded-lg" />
                                        
                                        {/* Time Slots */}
                                        <div className="space-y-4">
                                            {Array.from({ length: 3 }).map((_, timeIndex) => (
                                                <div key={timeIndex} className="space-y-2">
                                                    {/* Time Label */}
                                                    <Skeleton className="h-7 w-20 mx-auto bg-white/10" />
                                                    
                                                    {/* Activity Cards */}
                                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                                        {Array.from({ length: Math.min(activitiesPerDay, dayIndex % 3 + 1) }).map((_, activityIndex) => (
                                                            <Skeleton
                                                                key={activityIndex}
                                                                className="flex-shrink-0 h-16 w-48 bg-white/5 border border-white/10 rounded-xl"
                                                            />
                                                        ))}
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
                    <div className="space-y-8 lg:hidden">
                        {Array.from({ length: dayCount }).map((_, dayIndex) => (
                            <div key={dayIndex}>
                                {/* Day Header Skeleton */}
                                <Skeleton className="h-7 w-48 mb-4 bg-white/10" />
                                
                                <div className="space-y-6">
                                    {Array.from({ length: 3 }).map((_, timeIndex) => (
                                        <div key={timeIndex} className="space-y-3">
                                            {/* Time Label */}
                                            <Skeleton className="h-7 w-20 bg-white/10" />
                                            
                                            {/* Activity Cards Grid */}
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {Array.from({ length: Math.min(activitiesPerDay, dayIndex % 3 + 1) }).map((_, activityIndex) => (
                                                    <Skeleton
                                                        key={activityIndex}
                                                        className="h-16 bg-white/5 border border-white/10 rounded-xl"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expand/Collapse Button Skeleton */}
                <div className="mt-6 flex justify-center">
                    <Skeleton className="h-10 w-32 rounded-xl bg-white/10" />
                </div>
            </div>
        </section>
    );
}
