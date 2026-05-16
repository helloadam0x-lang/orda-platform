import { create } from "zustand";
import { Business, Staff, Notification, Conversation } from "@/types";

interface OrdaState {
  currentBusiness: Business | null;
  currentUser: Staff | null;
  notifications: Notification[];
  activeConversations: Conversation[];
  isConnected: boolean;
  selectedPlatform: string;

  setBusiness: (business: Business | null) => void;
  setUser: (user: Staff | null) => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  setConnected: (connected: boolean) => void;
  setSelectedPlatform: (platform: string) => void;
}

export const useOrdaStore = create<OrdaState>((set) => ({
  currentBusiness: null,
  currentUser: null,
  notifications: [],
  activeConversations: [],
  isConnected: false,
  selectedPlatform: "whatsapp",

  setBusiness: (business) => set({ currentBusiness: business }),
  setUser: (user) => set({ currentUser: user }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  clearNotifications: () => set({ notifications: [] }),
  setConnected: (connected) => set({ isConnected: connected }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
}));
