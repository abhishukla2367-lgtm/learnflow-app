/**
 * Returns a human-friendly relative time string.
 * e.g.  "just now", "5 min ago", "2 hours ago", "yesterday", "May 3"
 */
export function formatDistanceToNow(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now   = new Date();
  const secs  = Math.floor((now - date) / 1000);

  if (secs < 10)  return 'just now';
  if (secs < 60)  return `${secs}s ago`;

  const mins = Math.floor(secs / 60);
  if (mins < 60)  return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;

  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7)   return `${days} days ago`;

  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}