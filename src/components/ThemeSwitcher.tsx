import { useState, useEffect } from "react";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false; 
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  function handleThemeSwitcher() {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  }
  return (
    <button
      onClick={handleThemeSwitcher}
      className="w-10 h-10 flex justify-center items-center absolute bottom-8 left-7 rounded-full bg-white dark:bg-dark border border-[#EBEBF5] dark:border-[#1C1C1C]"
    >
      <div className="w-6 h-6">
        <img
          src={isDark ? SunIcon : MoonIcon}
          alt="theme-icon"
          className="w-full h-full object-contain"
        />
      </div>
    </button>
  );
}
