export function parseDuration(input) {
    if (!input || typeof input !== 'string') return null;
    const match = input.trim().toLowerCase().match(/^(\d+)\s*(s|m|h|d|w)?$/);
    if (!match) return null;
    const val = Number(match[1]);
    const unit = match[2] || 'm';
    const multipliers = { 
        s: 1000, 
        m: 60 * 1000, 
        h: 60 * 60 * 1000, 
        d: 24 * 60 * 60 * 1000, 
        w: 7 * 24 * 60 * 60 * 1000 
    };
    return val * (multipliers[unit] || multipliers.m);
}

export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) return `${weeks}s`;
    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
}
