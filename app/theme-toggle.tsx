"use client";

import { useEffect, useRef, useState } from "react";
import { themeStorageKey } from "./theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const explicitChoice = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let saved;
    try { saved = localStorage.getItem(themeStorageKey); } catch {}
    explicitChoice.current = saved === "light" || saved === "dark";
    const apply = (isDark: boolean) => {
      document.documentElement.dataset.theme = isDark ? "dark" : "light";
      setDark(isDark);
    };
    apply(explicitChoice.current ? saved === "dark" : media.matches);
    const followSystem = () => {
      if (!explicitChoice.current) apply(media.matches);
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme !== "dark";
    explicitChoice.current = true;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    setDark(next);
    try { localStorage.setItem(themeStorageKey, next ? "dark" : "light"); } catch {}
  }

  return <button type="button" className="theme-toggle" aria-pressed={dark} onClick={toggle}>
    <span aria-hidden="true">◐</span> Dark mode
  </button>;
}
