import moment from "moment";

export function getCurrentWeekDate() {
  const currentDate = moment();

  const weekStart = currentDate.clone().startOf("week");

  return new Array(7).fill(0).map((_, i) => moment(weekStart).add(i, "days"));
}
