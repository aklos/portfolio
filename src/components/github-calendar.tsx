"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

export default function GithubContributions() {
    const [mounted, setMounted] = useState(false);
    const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        setMounted(true);
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        setColorScheme(mq.matches ? "dark" : "light");
        const handler = (e: MediaQueryListEvent) =>
            setColorScheme(e.matches ? "dark" : "light");
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    if (!mounted) return null;

    const lightTheme = {
        dark: ["#e5e0d5", "#c6d9a8", "#93b86a", "#5f9330", "#3d6b1b"],
        light: ["#e5e0d5", "#c6d9a8", "#93b86a", "#5f9330", "#3d6b1b"],
    };

    return (
        <div className="github-calendar max-w-4xl mx-auto px-6 pb-12">
            <GitHubCalendar
                username="aklos"
                colorScheme={colorScheme}
                fontSize={12}
                theme={colorScheme === "light" ? lightTheme : undefined}
            />
        </div>
    );
}
