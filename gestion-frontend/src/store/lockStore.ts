// store/lockStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LockStore {
  isLocked: boolean;
  lockTimestamp: number | null;
  lastActivity: number;
  lockedByInactivity: boolean;

  // Actions
  lock: (byInactivity?: boolean) => void;
  unlock: () => void;
  updateActivity: () => void;
  isSessionExpired: () => boolean;
  clear: () => void;
}

export const useLockStore = create<LockStore>()(
  persist(
    (set, get) => ({
      isLocked: false,
      lockTimestamp: null,
      lastActivity: Date.now(),
      lockedByInactivity: false,

      lock: (byInactivity = false) => {
        set({
          isLocked: true,
          lockTimestamp: Date.now(),
          lockedByInactivity: byInactivity,
        });
      },

      unlock: () => {
        set({
          isLocked: false,
          lockTimestamp: null,
          lockedByInactivity: false,
          lastActivity: Date.now(), // Réinitialiser l'activité après déverrouillage
        });
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },

      isSessionExpired: () => {
        const { lockTimestamp } = get();
        if (!lockTimestamp) return false;

        // Session expire après 24 heures de verrouillage
        const LOCK_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 heures
        return Date.now() - lockTimestamp > LOCK_EXPIRY_TIME;
      },

      clear: () => {
        set({
          isLocked: false,
          lockTimestamp: null,
          lastActivity: Date.now(),
          lockedByInactivity: false,
        });
      },
    }),
    {
      name: "lock-storage",
      partialize: (state) => ({
        isLocked: state.isLocked,
        lockTimestamp: state.lockTimestamp,
        lockedByInactivity: state.lockedByInactivity,
      }),
    }
  )
);
