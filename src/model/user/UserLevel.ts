export enum UserLevel {
    ADMIN = 10,
    LIBRARIAN = 8,
    USER = 5,
    GUEST = 0,
}

/**
 * Normalizes a UserLevel that may arrive as its numeric value or as its enum
 * key name (depending on the source: in-memory defaults vs. API responses)
 * into a comparable number.
 */
export const levelValue = (level: UserLevel | string | undefined | null): number => {
    if (level === undefined || level === null || level === '') {
        return UserLevel.GUEST;
    }
    if (typeof level === 'number') {
        return level;
    }
    const numeric = Number(level);
    if (!Number.isNaN(numeric)) {
        return numeric;
    }
    const byName = UserLevel[level as keyof typeof UserLevel];
    return byName ?? UserLevel.GUEST;
}

export const hasLevel = (
    userLevel: UserLevel | string | undefined | null,
    requiredLevel: UserLevel | string | undefined | null,
): boolean => {
    return levelValue(userLevel) >= levelValue(requiredLevel);
}

export const isLevel = (
    userLevel: UserLevel | string | undefined | null,
    target: UserLevel,
): boolean => {
    return levelValue(userLevel) === levelValue(target);
}

export const levelName = (level: UserLevel | string | undefined | null): string => {
    return UserLevel[levelValue(level)] ?? '';
}