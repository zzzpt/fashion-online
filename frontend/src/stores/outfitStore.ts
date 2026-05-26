import { create } from "zustand";

export interface CanvasItem {
  clothingId: string;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface Look {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  scene?: string;
  season?: string;
  weatherCondition?: string;
  temperature?: number;
  layoutData: { items: CanvasItem[] } | null;
  isAiGenerated: boolean;
  isPublic: boolean;
  likeCount: number;
  createdAt: string;
}

interface OutfitState {
  currentCanvas: CanvasItem[];
  currentLook: Look | null;
  looks: Look[];
  isDragging: boolean;
  selectedBackground: string;
  addToCanvas: (item: CanvasItem) => void;
  removeFromCanvas: (clothingId: string) => void;
  updateCanvasItem: (
    clothingId: string,
    data: Partial<CanvasItem>,
  ) => void;
  clearCanvas: () => void;
  setCurrentLook: (look: Look | null) => void;
  setLooks: (looks: Look[]) => void;
  setIsDragging: (dragging: boolean) => void;
  setSelectedBackground: (bg: string) => void;
}

export const useOutfitStore = create<OutfitState>((set) => ({
  currentCanvas: [],
  currentLook: null,
  looks: [],
  isDragging: false,
  selectedBackground: "#F9F6F0",
  addToCanvas: (item) =>
    set((s) => ({ currentCanvas: [...s.currentCanvas, item] })),
  removeFromCanvas: (clothingId) =>
    set((s) => ({
      currentCanvas: s.currentCanvas.filter(
        (i) => i.clothingId !== clothingId,
      ),
    })),
  updateCanvasItem: (clothingId, data) =>
    set((s) => ({
      currentCanvas: s.currentCanvas.map((i) =>
        i.clothingId === clothingId ? { ...i, ...data } : i,
      ),
    })),
  clearCanvas: () => set({ currentCanvas: [] }),
  setCurrentLook: (currentLook) => set({ currentLook }),
  setLooks: (looks) => set({ looks }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setSelectedBackground: (selectedBackground) => set({ selectedBackground }),
}));