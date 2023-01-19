export function isToday(date: Date): boolean {
  const today = new Date();

  if (today.toDateString() === date.toDateString()) {
    return true;
  }

  return false;
}
export function isTomorrow(date: Date): boolean {
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));

  if (tomorrow.toDateString() === date.toDateString()) {
    return true;
  }

  return false;
}
