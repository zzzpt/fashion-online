import { create } from "zustand";

export type ClothingCategory =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoes"
  | "bag"
  | "accessory";

export type ClothingStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export interface ClothingItem {
  id: string;
  userId: string;
  imageUrl: string;
  imageNoBgUrl?: string;
  category: ClothingCategory;
  subCategory?: string;
  color?: string;
  colorPalette?: string[];
  material?: string;
  brand?: string;
  season?: string[];
  styleTags?: string[];
  aiDescription?: string;
  isFavorite: boolean;
  wearCount: number;
  status: ClothingStatus;
  createdAt: string;
}

interface WardrobeFilters {
  category: ClothingCategory | "all";
  color?: string;
  styleTag?: string;
}

interface WardrobeState {
  items: ClothingItem[];
  filters: WardrobeFilters;
  selectedItem: ClothingItem | null;
  isLoading: boolean;
  setItems: (items: ClothingItem[]) => void;
  addItem: (item: ClothingItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, data: Partial<ClothingItem>) => void;
  setFilters: (filters: Partial<WardrobeFilters>) => void;
  setSelectedItem: (item: ClothingItem | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useWardrobeStore = create<WardrobeState>((set) => ({
  items: [],
  filters: { category: "all" },
  selectedItem: null,
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  updateItem: (id, data) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
    })),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setLoading: (isLoading) => set({ isLoading }),
}));