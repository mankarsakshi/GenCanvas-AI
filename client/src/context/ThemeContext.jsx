import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Read saved theme preference
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("app_theme");
      if (savedTheme && ["Light", "Dark", "System"].includes(savedTheme)) {
        return savedTheme;
      }
      const savedSettings = localStorage.getItem("user_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed?.theme && ["Light", "Dark", "System"].includes(parsed.theme)) {
          return parsed.theme;
        }
      }
    } catch {
      // Fallback default
    }
    return "Light";
  });

  // Apply theme to DOM (document.documentElement and data-theme)
  const applyThemeToDOM = (selectedTheme) => {
    const root = document.documentElement;
    const isSystemDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (selectedTheme === "Dark" || (selectedTheme === "System" && isSystemDark)) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      document.body.classList.add("dark-theme");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      document.body.classList.remove("dark-theme");
    }
  };

  // Change theme handler
  const setTheme = (newTheme) => {
    if (!["Light", "Dark", "System"].includes(newTheme)) return;
    setThemeState(newTheme);
    localStorage.setItem("app_theme", newTheme);
    applyThemeToDOM(newTheme);
  };

  // Initial and reactive theme application
  useEffect(() => {
    applyThemeToDOM(theme);

    // Watch OS system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "System") {
        applyThemeToDOM("System");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [theme]);

  const isDarkMode =
    theme === "Dark" ||
    (theme === "System" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const value = {
    theme,
    setTheme,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
