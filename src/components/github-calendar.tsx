"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

export default function GithubContributions() {
    const [mounted, setMounted] = useState(false);
    const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        setMounted(true);
        const root = document.documentElement;
        const read = () =>
            setColorScheme(root.classList.contains("dark") ? "dark" : "light");
        read();
        const observer = new MutationObserver(read);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    if (!mounted) return null;

    /* mist → signal, matching the theme tokens in globals.css */
    const theme = {
        light: ["#ececea", "#c4dcf3", "#8fbfe8", "#4f94d6", "#1568b8"],
        dark: ["#1a1c20", "#1d3350", "#245081", "#3579bd", "#58b0f0"],
    };

    return (
        <div className="github-calendar">
            <GitHubCalendar
                username="aklos"
                colorScheme={colorScheme}
                fontSize={12}
                theme={theme}
            />
        </div>
    );
}
