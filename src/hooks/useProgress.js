import { useState, useCallback, useEffect } from 'react';
import { TOTAL_JUZ, juzData, getTodayString } from '../data/quranData';

const STORAGE_KEY = 'tilawat_progress';

function getDefaultProgress() {
    return {
        // Goal settings
        targetKhatam: 1,
        targetDays: 30,
        distributionMode: 'per_hari', // 'per_hari' | 'per_shalat' | 'bebas'
        startDate: null,

        // Reading progress
        completedJuz: 0,
        juzStatus: Array(TOTAL_JUZ).fill('not_started'), // 'not_started' | 'in_progress' | 'completed'
        totalPagesRead: 0,

        // Streak
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null,

        // Daily logs: { [dateString]: { pagesRead, juzCompleted[], timestamp } }
        dailyLogs: {},

        // Misc
        fajrReadCount: 0,
        onboardingComplete: false,
        activeDays: 0,
    };
}

function loadProgress() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...getDefaultProgress(), ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
    return getDefaultProgress();
}

function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
}

export function useProgress() {
    const [progress, setProgress] = useState(loadProgress);

    // Persist on change
    useEffect(() => {
        saveProgress(progress);
    }, [progress]);

    // Complete onboarding with goal settings
    const completeOnboarding = useCallback((settings) => {
        setProgress(prev => ({
            ...prev,
            targetKhatam: settings.targetKhatam || 1,
            targetDays: settings.targetDays || 30,
            distributionMode: settings.distributionMode || 'per_hari',
            startDate: getTodayString(),
            onboardingComplete: true,
        }));
    }, []);

    // Log reading for today
    const logReading = useCallback((juzNumbers = [], pagesRead = 0) => {
        setProgress(prev => {
            const today = getTodayString();
            const newJuzStatus = [...prev.juzStatus];
            let newCompletedJuz = prev.completedJuz;

            // Mark juz as completed
            juzNumbers.forEach(juzNum => {
                if (juzNum >= 1 && juzNum <= TOTAL_JUZ) {
                    newJuzStatus[juzNum - 1] = 'completed';
                }
            });
            newCompletedJuz = newJuzStatus.filter(s => s === 'completed').length;

            // Mark next juz as in_progress if any
            const nextNotStarted = newJuzStatus.findIndex(s => s === 'not_started');
            if (nextNotStarted >= 0 && newCompletedJuz > 0) {
                newJuzStatus[nextNotStarted] = 'in_progress';
            }

            // Calculate streak
            let newStreak = prev.currentStreak;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (prev.lastReadDate === today) {
                // Already logged today, just update
                newStreak = prev.currentStreak;
            } else if (prev.lastReadDate === yesterdayStr) {
                newStreak = prev.currentStreak + 1;
            } else if (!prev.lastReadDate) {
                newStreak = 1;
            } else {
                newStreak = 1; // streak broken
            }

            const actualPagesRead = pagesRead || juzNumbers.length * 20;

            // Check if reading before 6am (Fajr badge)
            const now = new Date();
            const isFajrTime = now.getHours() < 6;

            // Daily log
            const existingLog = prev.dailyLogs[today] || { pagesRead: 0, juzCompleted: [], timestamp: null };
            const updatedLog = {
                pagesRead: existingLog.pagesRead + actualPagesRead,
                juzCompleted: [...new Set([...existingLog.juzCompleted, ...juzNumbers])],
                timestamp: new Date().toISOString(),
            };

            const newDailyLogs = { ...prev.dailyLogs, [today]: updatedLog };
            const newActiveDays = Object.keys(newDailyLogs).length;

            return {
                ...prev,
                completedJuz: newCompletedJuz,
                juzStatus: newJuzStatus,
                totalPagesRead: prev.totalPagesRead + actualPagesRead,
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
                lastReadDate: today,
                fajrReadCount: isFajrTime ? prev.fajrReadCount + 1 : prev.fajrReadCount,
                dailyLogs: newDailyLogs,
                activeDays: newActiveDays,
            };
        });
    }, []);

    // Quick complete today's target
    const quickCompleteToday = useCallback(() => {
        const nextJuz = progress.juzStatus.findIndex(s => s !== 'completed') + 1;
        if (nextJuz > 0 && nextJuz <= TOTAL_JUZ) {
            logReading([nextJuz], juzData[nextJuz - 1].pages);
        }
    }, [progress.juzStatus, logReading]);

    // Get today's target info
    const getTodayTarget = useCallback(() => {
        const nextJuzIndex = progress.juzStatus.findIndex(s => s !== 'completed');
        if (nextJuzIndex < 0) {
            return { juz: TOTAL_JUZ, ...juzData[TOTAL_JUZ - 1], isComplete: true };
        }
        return { ...juzData[nextJuzIndex], isComplete: false };
    }, [progress.juzStatus]);

    // Get daily pages target
    const getDailyTarget = useCallback(() => {
        const remainingJuz = TOTAL_JUZ - progress.completedJuz;
        const remainingPages = remainingJuz * 20;

        if (!progress.startDate) return { pagesPerDay: 20, pagesPerShalat: 4 };

        const start = new Date(progress.startDate);
        const now = new Date();
        const elapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        const remainingDays = Math.max(1, progress.targetDays - elapsed);

        const pagesPerDay = Math.ceil(remainingPages / remainingDays);
        const pagesPerShalat = Math.ceil(pagesPerDay / 5);

        return { pagesPerDay, pagesPerShalat, remainingDays, remainingPages };
    }, [progress]);

    // Get overall percentage
    const getPercentage = useCallback(() => {
        return Math.round((progress.completedJuz / TOTAL_JUZ) * 100);
    }, [progress.completedJuz]);

    // Get consistency score
    const getConsistency = useCallback(() => {
        if (!progress.startDate) return 0;
        const start = new Date(progress.startDate);
        const now = new Date();
        const totalDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1);
        return Math.min(100, Math.round((progress.activeDays / totalDays) * 100));
    }, [progress]);

    // Check if today's reading is done
    const isTodayComplete = useCallback(() => {
        const today = getTodayString();
        return !!progress.dailyLogs[today];
    }, [progress.dailyLogs]);

    // Reset all progress
    const resetProgress = useCallback(() => {
        setProgress(getDefaultProgress());
    }, []);

    // Update settings
    const updateSettings = useCallback((settings) => {
        setProgress(prev => ({ ...prev, ...settings }));
    }, []);

    return {
        progress,
        completeOnboarding,
        logReading,
        quickCompleteToday,
        getTodayTarget,
        getDailyTarget,
        getPercentage,
        getConsistency,
        isTodayComplete,
        resetProgress,
        updateSettings,
    };
}
