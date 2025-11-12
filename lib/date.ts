import { format, getDay, getYear } from "date-fns";
import { cacheLife } from "next/cache";
import { cache } from "react";

export const getToday = async () => {
  "use cache";
  cacheLife("days");

  return new Date();
};

export const getFirstDayOfWeek = async (today: Date) => {
  const day = getDay(today);
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(today.setDate(diff));
};

export const fetchPlanning = cache(async () => {
  const today = await getToday();
  const firstDayOfWeek = await getFirstDayOfWeek(today);

  const response = await fetch(
    `https://sport.nubapp.com/api/v4/activities/activities-calendar/guests?app_version=5.10.02&id_application=89834312&start_timestamp=${format(
      firstDayOfWeek,
      "dd-MM-yyyy"
    )}&end_timestamp=${format(
      new Date(`12-31-${getYear(today)}`),
      "dd-MM-yyyy"
    )}&id_category_activity=459`
  );

  return response.json();
});
