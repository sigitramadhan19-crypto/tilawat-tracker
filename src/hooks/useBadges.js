import { useMemo } from 'react';
import { badgeDefinitions, calculateXP, getLevel } from '../data/quranData';

export function useBadges(progress) {
    const unlockedBadges = useMemo(() => {
        return badgeDefinitions.filter(badge => badge.condition(progress));
    }, [progress]);

    const lockedBadges = useMemo(() => {
        return badgeDefinitions.filter(badge => !badge.condition(progress));
    }, [progress]);

    const xp = useMemo(() => calculateXP(progress), [progress]);
    const level = useMemo(() => getLevel(xp), [xp]);

    const newlyUnlocked = useMemo(() => {
        // Check if any badge was just unlocked (for notification)
        // This is a simple check — in a real app, you'd compare with previous state
        return unlockedBadges;
    }, [unlockedBadges]);

    return {
        unlockedBadges,
        lockedBadges,
        allBadges: badgeDefinitions,
        xp,
        level,
        newlyUnlocked,
    };
}
