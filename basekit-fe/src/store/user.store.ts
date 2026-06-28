import { create } from "zustand";

export interface UserData {
  id: string;
  username: string;
  isSuperAdmin: boolean;
  roles: {
    id: string;
    permissions: {
      id: string;
      value: string;
    }[];
  }[];
}

interface UserState {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
