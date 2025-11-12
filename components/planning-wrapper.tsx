"use cache"

import { fetchPlanning } from "@/lib/date";
import Planning from "./planning";
import { cacheLife } from "next/cache";

export const PlanningWrapper = async () => {
    cacheLife("hours")

    const data = await fetchPlanning();

    return (
        <Planning data={data} />
    );
};