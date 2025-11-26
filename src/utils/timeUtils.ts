import { Hours } from "../types/restaurant";

export function isRestaurantOpen(hours?: Hours): boolean {
  if (!hours) return false;
  
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof Hours;
  const todayHours = hours[dayOfWeek];
  
  if (todayHours === "Closed") return false;
  
  // Parse the hours (e.g., "11:00 AM - 10:00 PM")
  const [openTime, closeTime] = todayHours.split(" - ");
  if (!openTime || !closeTime) return false;
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTimeToMinutes(openTime);
  const closeMinutes = parseTimeToMinutes(closeTime);
  
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

function parseTimeToMinutes(time: string): number {
  const [timePart, period] = time.trim().split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  
  let totalMinutes = hours * 60 + minutes;
  
  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    totalMinutes -= 12 * 60;
  }
  
  return totalMinutes;
}

export function getCurrentDayHours(hours?: Hours): string {
  if (!hours) return "Hours not available";
  
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof Hours;
  return hours[dayOfWeek];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
