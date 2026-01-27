import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";

import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

  return (
    <html
      lang="en"
      className={themeMode === "dark" ? "dark" : ""}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ErrorBoundary>
          <ReduxProvider>
            <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
              <AuthProvider>{children}</AuthProvider>
              <Toaster
                toastOptions={
                  {
                    position: "top-right",
                    error: {
                      classNames: {
                        toast: "border border-red-500 bg-red-50 text-red-700 font-medium",
                        title: "text-red-700",
                        description: "text-red-600",
                        actionButton: "bg-red-100 text-red-800 hover:bg-red-200",
                        cancelButton: "text-red-500",
                      },
                    },
                    success: {
                      classNames: {
                        toast: "border border-green-500 bg-green-50 text-green-700 font-medium",
                        title: "text-green-700",
                        description: "text-green-600",
                        actionButton: "bg-green-100 text-green-800 hover:bg-green-200",
                        cancelButton: "text-green-500",
                      },
                    },
                  } as any
                }
              />
            </PreferencesStoreProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
