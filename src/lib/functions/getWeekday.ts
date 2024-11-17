export function getWeekday(dateString: string) {
  const daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const dayIndex = new Date(dateString).getDay();
  return daysOfWeek[dayIndex];
}
