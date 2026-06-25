import { create } from 'zustand';

interface WatchlistState {
  savedIds: string[];
  toggleWatchlist: (id: string) => void;
  isWatchlisted: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  savedIds: [],
  toggleWatchlist: (id: string) => set((state) => {
    const isSaved = state.savedIds.includes(id);
    if (isSaved) {
      return { savedIds: state.savedIds.filter(i => i !== id) };
    } else {
      return { savedIds: [...state.savedIds, id] };
    }
  }),
  isWatchlisted: (id: string) => get().savedIds.includes(id),
}));
