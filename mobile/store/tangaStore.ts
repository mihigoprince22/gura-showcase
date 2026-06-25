import { create } from 'zustand';

export interface TangaState {
  photos: string[];
  title: string;
  category: string;
  condition: string;
  description: string;
  format: 'Fixed' | 'Auction';
  price: string;
  district: string;
  setPhotos: (photos: string[]) => void;
  setTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setCondition: (condition: string) => void;
  setDescription: (description: string) => void;
  setFormat: (format: 'Fixed' | 'Auction') => void;
  setPrice: (price: string) => void;
  setDistrict: (district: string) => void;
  reset: () => void;
}

const initialState = {
  photos: [],
  title: '',
  category: '',
  condition: '',
  description: '',
  format: 'Fixed' as const,
  price: '',
  district: '',
};

export const useTangaStore = create<TangaState>((set) => ({
  ...initialState,
  setPhotos: (photos) => set({ photos }),
  setTitle: (title) => set({ title }),
  setCategory: (category) => set({ category }),
  setCondition: (condition) => set({ condition }),
  setDescription: (description) => set({ description }),
  setFormat: (format) => set({ format }),
  setPrice: (price) => set({ price }),
  setDistrict: (district) => set({ district }),
  reset: () => set(initialState),
}));
