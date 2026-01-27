"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/stores";
import { hydrateAuth } from "@/stores/slices/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Hydrate auth state from localStorage on client side
      store.dispatch(hydrateAuth());
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
