const cache = new Map();

function setInCache(key, value, ttl = 600) {
  const expiresAt = Date.now() + (ttl * 1000);
  cache.set(key, { value, expiresAt });
}

function getFromCache(key) {
  const item = cache.get(key);
  
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

function clearCache() {
  cache.clear();
}

setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.expiresAt) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000);

module.exports = { setInCache, getFromCache, clearCache };