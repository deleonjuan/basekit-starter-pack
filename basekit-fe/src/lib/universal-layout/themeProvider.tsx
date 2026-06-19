/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createContext, type PropsWithChildren, use, useState } from "react";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type Theme = "light" | "dark";
type ThemeContextVal = {
  theme: Theme;
  setTheme: (val: Theme) => void;
  toggleTheme: () => void;
};
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);
const storageKey = "ui-theme";

export const getThemeServerFn = createServerFn().handler(async () => {
  return (getCookie(storageKey) || "light") as Theme;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data != "string" || (data != "dark" && data != "light")) {
      throw new Error("Invalid theme provided");
    }
    return data as Theme;
  })
  .handler(async ({ data }) => {
    setCookie(storageKey, data);
  });

export function ThemeProvider({ children, theme }: Props) {
  const [_theme, _setTheme] = useState(theme);
  const router = useRouter();

  function setTheme(val: Theme) {
    setThemeServerFn({ data: val });
    _setTheme(val);
    router.invalidate();
  }

  function toggleTheme() {
    if (_theme === "dark") setTheme("light");
    else setTheme("dark");
  }

  return (
    <ThemeContext value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const val = use(ThemeContext);
  if (!val) throw new Error("useTheme called outside of ThemeProvider!");
  return val;
}
