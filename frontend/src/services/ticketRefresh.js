const listeners = new Set();
const ticketCache = new Map();
const CACHE_TTL_MS = 30_000;

export function getCachedTickets(endpoint) {
    return ticketCache.get(endpoint)?.tickets ?? null;
}

export function hasFreshTicketCache(endpoint) {
    const cachedTickets = ticketCache.get(endpoint);

    return cachedTickets !== undefined && Date.now() - cachedTickets.updatedAt < CACHE_TTL_MS;
}

export function setCachedTickets(endpoint, tickets) {
    ticketCache.set(endpoint, {
        tickets,
        updatedAt: Date.now()
    });
}

export function getCachedStatistics() {
    return ticketCache.get("admin-statistics")?.stats ?? null;
}

export function hasFreshStatisticsCache() {
    const cachedStats = ticketCache.get("admin-statistics");

    return cachedStats !== undefined && Date.now() - cachedStats.updatedAt < CACHE_TTL_MS;
}

export function setCachedStatistics(stats) {
    ticketCache.set("admin-statistics", {
        stats,
        updatedAt: Date.now()
    });
}

export function getCachedTicketPage(cacheKey) {
    return ticketCache.get(cacheKey)?.page ?? null;
}

export function hasFreshTicketPageCache(cacheKey) {
    const cachedPage = ticketCache.get(cacheKey);

    return cachedPage !== undefined && Date.now() - cachedPage.updatedAt < CACHE_TTL_MS;
}

export function setCachedTicketPage(cacheKey, page) {
    ticketCache.set(cacheKey, {
        page,
        updatedAt: Date.now()
    });
}

export function subscribeToTicketRefresh(callback) {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
}

export function notifyTicketRefresh() {
    listeners.forEach((callback) => callback());
}
