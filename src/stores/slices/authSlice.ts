import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/types";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Helper function to safely access localStorage
const getFromLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const initialState: AuthState = {
  user: null,
  token: getFromLocalStorage("accessToken"),
  isAuthenticated: !!getFromLocalStorage("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.token);
      }
    },

    updateToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.token);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }

      toast.success("Logged Out Successfully");

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // Action to hydrate state from localStorage on client side
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setCredentials, updateToken, logout, updateUser, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
