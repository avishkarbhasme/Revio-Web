// Helper functions
function formatDuration(duration) {
  // Expects seconds, returns mm:ss
  const min = Math.floor(duration / 60);
  const sec = duration % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = Date.now();
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export {formatDuration,formatTimeAgo}