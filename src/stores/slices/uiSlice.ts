import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  theme: "light" | "dark";
  sidebarCollapsed: boolean;
  notificationsPanelOpen: boolean;
  currentPage: string;
  breadcrumbs: Array<{ label: string; path: string }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: UiState = {
  theme:
    typeof window !== "undefined" ? (window.localStorage.getItem("theme") as "light" | "dark") || "light" : "light",
  sidebarCollapsed: typeof window !== "undefined" ? window.localStorage.getItem("sidebarCollapsed") === "true" : false,
  notificationsPanelOpen: false,
  currentPage: "dashboard",
  breadcrumbs: [],
  isLoading: false,
  error: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },

    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem("sidebarCollapsed", String(state.sidebarCollapsed));
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem("sidebarCollapsed", String(action.payload));
    },

    toggleNotificationsPanel: (state) => {
      state.notificationsPanelOpen = !state.notificationsPanelOpen;
    },

    setNotificationsPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationsPanelOpen = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },

    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path: string }>>) => {
      state.breadcrumbs = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  toggleNotificationsPanel,
  setNotificationsPanelOpen,
  setCurrentPage,
  setBreadcrumbs,
  setLoading,
  setError,
} = uiSlice.actions;

export default uiSlice.reducer;
