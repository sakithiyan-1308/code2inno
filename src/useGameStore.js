import { create } from 'zustand';

export const useGameStore = create((set) => ({
    activeNote: null, // Holds the text to display (or null if closed)
    setNote: (text) => set({ activeNote: text }),
    closeNote: () => set({ activeNote: null }),

    // Track Progress (0.0 to 1.0)
    gameProgress: 0,
    setGameProgress: (progress) => set({ gameProgress: progress }),

    // Navigation System (Autopilot)
    navigationTarget: null,
    setNavigationTarget: (target) => set({ navigationTarget: target }),
    clearNavigationTarget: () => set({ navigationTarget: null }),
}));
