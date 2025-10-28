import { useEffect, useState } from "react";

export default function ThemeToggle({ showLabel }) {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button onClick={toggleDark}
      className="p-2 bg-gray-700 cursor-pointer text-white dark:text-black dark:bg-amber-200 rounded flex items-center gap-1"
      aria-label="Toggle theme"
    >
      {dark ? "☀" : "🌙"}
      {showLabel ? (dark ? "Light" : "Dark") : null}
    </button>
  );
}
