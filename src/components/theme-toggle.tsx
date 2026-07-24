"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setMounted(true);
        setDark(document.documentElement.classList.contains("dark"));
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {}
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted hover:text-blue transition-colors cursor-pointer"
        >
            <span className={mounted ? "" : "invisible"}>
                {dark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </span>
        </button>
    );
}
