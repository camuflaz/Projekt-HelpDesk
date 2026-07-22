const listeners = new Set();

export function subscribeToTicketRefresh(callback) {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
}

export function notifyTicketRefresh() {
    listeners.forEach((callback) => callback());
}
