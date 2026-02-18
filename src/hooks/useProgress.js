import { useState, useCallback, useEffect } from 'react';
import { TOTAL_JUZ, juzData, getTodayString } from '../data/quranData';
import { authClient } from '../lib/auth-client';

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
    const { data: session } = authClient.useSession();

    // Helper for API calls
    const apiCall = useCallback(async (endpoint, method = 'GET', body = null) => {
        if (!session) return null;
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);

            const res = await fetch(`/api${endpoint}`, options);
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Sync error:', e);
            return null;
        }
    }, [session]);

    // Initial Sync with Backend
    useEffect(() => {
        if (!session) return;

        const fetchData = async () => {
            try {
                const [goals, stats, history] = await Promise.all([
                    apiCall('/goals'),
                    apiCall('/progress/stats'),
                    apiCall('/reading/history')
                ]);

                setProgress(prev => {
                    const next = { ...prev };

                    if (goals) {
                        next.targetKhatam = goals.targetKhatam || prev.targetKhatam;
                        next.targetDays = goals.targetDays || prev.targetDays;
                        next.distributionMode = goals.distributionMode || prev.distributionMode;
                        next.startDate = goals.startDate || prev.startDate;
                        if (goals.startDate) next.onboardingComplete = true;
                    }

                    if (stats) {
                        next.currentStreak = stats.currentStreak ?? prev.currentStreak;
                        next.longestStreak = stats.longestStreak ?? prev.longestStreak;
                        next.totalPagesRead = stats.totalPagesRead ?? prev.totalPagesRead;
                        next.completedJuz = stats.completedJuzCount ?? prev.completedJuz;
                        next.lastReadDate = stats.lastReadDate ? stats.lastReadDate.split('T')[0] : prev.lastReadDate;
                        next.fajrReadCount = stats.fajrReadCount ?? prev.fajrReadCount;
                    }

                    if (history && Array.isArray(history)) {
                        const newLogs = {};
                        const juzStatus = Array(TOTAL_JUZ).fill('not_started');

                        history.forEach(log => {
                            const dateStr = log.date.split('T')[0];
                            newLogs[dateStr] = {
                                pagesRead: log.pagesRead,
                                juzCompleted: log.juzCompleted || [],
                                timestamp: log.readAt
                            };

                            // Rehydrate completed juz
                            if (log.juzCompleted) {
                                log.juzCompleted.forEach(j => {
                                    if (j > 0 && j <= TOTAL_JUZ) juzStatus[j - 1] = 'completed';
                                });
                            }
                        });

                        next.dailyLogs = { ...prev.dailyLogs, ...newLogs };

                        // Merge juz completion status
                        // Note: Backend gives history, so we trust backend for completed ones
                        // But we keep local 'completed' if not in backend? Ideally strict sync.
                        // For now strict sync on found logs:
                        next.juzStatus = next.juzStatus.map((s, i) =>
                            juzStatus[i] === 'completed' ? 'completed' : s
                        );

                        // Fix 'in_progress' pointer
                        const nextNotStarted = next.juzStatus.findIndex(s => s === 'not_started');
                        if (nextNotStarted >= 0 && next.juzStatus.some(s => s === 'completed')) {
                            next.juzStatus[nextNotStarted] = 'in_progress';
                        }
                    }

                    return next;
                });
            } catch (e) {
                console.error("Failed to sync initial data", e);
            }
        };

        fetchData();
    }, [session, apiCall]);

    // Persist on change (Local)
    useEffect(() => {
        saveProgress(progress);
    }, [progress]);

    // Complete onboarding with goal settings
    const completeOnboarding = useCallback((settings) => {
        const newSettings = {
            targetKhatam: settings.targetKhatam || 1,
            targetDays: settings.targetDays || 30,
            distributionMode: settings.distributionMode || 'per_hari',
            startDate: getTodayString(),
            onboardingComplete: true,
        };

        setProgress(prev => ({ ...prev, ...newSettings }));

        // Sync
        apiCall('/goals', 'POST', newSettings);
    }, [apiCall]);

    // Log reading for today
    const logReading = useCallback((juzNumbers = [], pagesRead = 0) => {
        const actualPagesRead = pagesRead || juzNumbers.length * 20;
        const today = getTodayString();

        // 1. Optimistic Update
        setProgress(prev => {
            const newJuzStatus = [...prev.juzStatus];
            let newCompletedJuz = prev.completedJuz;

            juzNumbers.forEach(juzNum => {
                if (juzNum >= 1 && juzNum <= TOTAL_JUZ) {
                    newJuzStatus[juzNum - 1] = 'completed';
                }
            });
            newCompletedJuz = newJuzStatus.filter(s => s === 'completed').length;

            const nextNotStarted = newJuzStatus.findIndex(s => s === 'not_started');
            if (nextNotStarted >= 0 && newCompletedJuz > 0) {
                newJuzStatus[nextNotStarted] = 'in_progress';
            }

            let newStreak = prev.currentStreak;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (prev.lastReadDate === today) {
                newStreak = prev.currentStreak;
            } else if (prev.lastReadDate === yesterdayStr) {
                newStreak = prev.currentStreak + 1;
            } else if (!prev.lastReadDate) {
                newStreak = 1;
            } else {
                newStreak = 1;
            }

            const now = new Date();
            const isFajrTime = now.getHours() < 6;

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

        // 2. Sync to Backend
        apiCall('/reading/log', 'POST', {
            date: today,
            juzNumbers,
            pagesRead: actualPagesRead
        });

    }, [apiCall]);

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
        // TODO: Add backend reset endpoint if needed, or just clear local
    }, []);

    // Update settings
    const updateSettings = useCallback((settings) => {
        setProgress(prev => ({ ...prev, ...settings }));
        apiCall('/goals', 'POST', settings);
    }, [apiCall]);

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
