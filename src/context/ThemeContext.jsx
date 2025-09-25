import { createContext, useContext, useMemo } from "react";

const defaultTheme = {
  colors: {
    primary: "#5E403F",
    secondary: "#A57878",
    text: "#EAE0D5",
    active: "#FFFFFF",
    card: "#5E403F",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
  mode: "dark",
};

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const value = useMemo(() => defaultTheme, []);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
