import { createContext, useContext, useRef } from "react";

export const SettingContext = createContext();

export function SettingProvider({ children }) {
  const addSettingRef = useRef(null);

  return (
    <SettingContext.Provider value={{ addSettingRef }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettingContext() {
  return useContext(SettingContext);
}