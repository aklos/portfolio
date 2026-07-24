"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/blog";

export function TocList({
    entries,
    active = null,
}: {
    entries: TocEntry[];
    active?: string | null;
}) {
    return (
        <ul className="flex flex-col gap-2.5 border-l border-line">
            {entries.map((entry) => (
                <li
                    key={entry.id}
                    className={entry.depth === 3 ? "pl-8" : "pl-4"}
                >
                    <a
                        href={`#${entry.id}`}
                        className={`block leading-snug transition-colors ${
                            active === entry.id
                                ? "text-blue"
                                : "text-muted hover:text-blue"
                        }`}
                    >
                        {entry.text}
                    </a>
                </li>
            ))}
        </ul>
    );
}

export default function Toc({ entries }: { entries: TocEntry[] }) {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const onScroll = () => {
            let current: string | null = null;
            for (const entry of entries) {
                const el = document.getElementById(entry.id);
                if (el && el.getBoundingClientRect().top <= 120) {
                    current = entry.id;
                }
            }
            setActive(current);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [entries]);

    return (
        <nav aria-label="Table of contents" className="text-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
                On this page
            </p>
            <TocList entries={entries} active={active} />
        </nav>
    );
}
