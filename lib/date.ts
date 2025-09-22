import { format, getDay } from "date-fns";

export const getFirstDayOfWeek = () => {
  const today = new Date();
  const day = getDay(today);
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(today.setDate(diff));
};

export const getLastDayOfWeek = () => {
  const today = new Date();
  const day = getDay(today);
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(today.setDate(diff + 6));
};

export const fetchPlanning = async () => {
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();

  const response = await fetch(
    `https://sport.nubapp.com/api/v4/activities/activities-calendar/guests?app_version=5.10.02&id_application=89834312&start_timestamp=${format(
      firstDayOfWeek,
      "dd-MM-yyyy"
    )}&end_timestamp=${format(
      lastDayOfWeek,
      "dd-MM-yyyy"
    )}&id_category_activity=459`
  );

  return response.json();
};
