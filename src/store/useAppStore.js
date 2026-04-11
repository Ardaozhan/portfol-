/**
 * Global Application Store — Zustand
 *
 * Slices:
 * - isLoaded      — loading gate for entrance animations
 * - scrollProgress — normalised [0,1] from Lenis
 * - theme          — 'dark' | 'light'
 * - mouse          — normalised cursor position {x,y} ∈ [-0.5, 0.5]
 *                    written by Hero DOM, read by WebGL components
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAppStore = create(
    persist(
        (set) => ({
            // ─── Loading State ─────────────────────────────────────────────────────────
            isLoaded: false,
            setIsLoaded: (value) => set({ isLoaded: value }),

            // ─── Scroll Progress ───────────────────────────────────────────────────────
            scrollProgress: 0,
            setScrollProgress: (value) => set({ scrollProgress: value }),

            // ─── Theme ─────────────────────────────────────────────────────────────────
            theme: 'dark',
            toggleTheme: () =>
                set((state) => {
                    const next = state.theme === 'dark' ? 'light' : 'dark';
                    document.documentElement.classList.toggle('dark', next === 'dark');
                    return { theme: next };
                }),

            // ─── Mouse Position ────────────────────────────────────────────────────────
            mouse: { x: 0, y: 0 },
            setMouse: (value) => set({ mouse: value }),

            // ─── Cursor Variant ────────────────────────────────────────────────────────
            cursorVariant: 'default',
            setCursorVariant: (value) => set({ cursorVariant: value }),

            // ─── Scene Theme ───────────────────────────────────────────────────────────
            sceneTheme: 'dark',
            setSceneTheme: (value) => set({ sceneTheme: value }),

            // ─── Scroll Persistence ────────────────────────────────────────────────────
            homeScrollY: 0,
            setHomeScrollY: (value) => set({ homeScrollY: value }),
        }),
        {
            name: 'arda-portfolio-storage', // unique name
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ homeScrollY: state.homeScrollY, theme: state.theme }), // only stay these
        }
    )
);

export default useAppStore;
