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

    const theme = {
        light: ["#eef3fb", "#b3cdf1", "#7fabe8", "#4a86de", "#1d5fce"],
        dark: ["#16273f", "#24406a", "#33589a", "#4a79cd", "#6fa3f0"],
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
