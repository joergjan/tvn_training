export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (getMonth() returns 0-11, so add 1)
  // const year = date.getFullYear(); // Get full year

  return `${day}.${month}.`; //.${year}
}
