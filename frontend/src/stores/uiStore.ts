import { create } from "zustand";

interface UIState {
  isUploading: boolean;
  uploadProgress: number;
  isAiProcessing: boolean;
  activeModal: string | null;
  toasts: Toast[];
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setAiProcessing: (processing: boolean) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export const useUIStore = create<UIState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  isAiProcessing: false,
  activeModal: null,
  toasts: [],
  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setAiProcessing: (isAiProcessing) => set({ isAiProcessing }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));