"use client";

import { useState } from "react";
import Accent, { type Pattern } from "@/components/accent";

export interface Project {
    name: string;
    kind: string;
    /* "2023", or "2026–" for something still in progress */
    years: string;
    desc: string;
    stack: string;
    /* 16:10 screenshot under public/projects */
    shot?: string;
    /* the card's accent, drawn behind the screenshot */
    accent: { pattern: Pattern; color: string };
    /* shown as the footnote, so a real domain or path rather than "Website" */
    link: { label: string; href: string };
}

/* One card per project. Kind and name top-left, years top-right, stack and
   link at the foot. The right half holds the accent, faded in from the
   left so it never reaches the text, with the screenshot over it running
   off the bottom-right corner like a window onto the app. On hover the
   accent zooms slowly and starts moving, and the screenshot lifts. */
export default function ProjectCard({ project }: { project: Project }) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={project.link.href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative grid md:grid-cols-[5fr_6fr] overflow-hidden rounded-md bg-mist shadow-(--shadow-card) hover:bg-mist-strong transition-colors duration-300"
        >
            <span className="absolute top-6 right-6 z-10 text-[11px] font-semibold tabular-nums">
                {project.years}
            </span>

            <div className="relative z-10 flex flex-col p-6 min-h-64">
                <div>
                    <p className="text-xs text-muted">{project.kind}</p>
                    <h3 className="text-xl font-semibold tracking-tight leading-snug mt-1">
                        {project.name}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mt-2 max-w-sm">
                        {project.desc}
                    </p>
                </div>
                <div className="mt-auto pt-8 text-xs text-muted">
                    <span className="block">{project.stack}</span>
                    <span className="block font-mono text-ink mt-0.5 break-all group-hover:underline underline-offset-4">
                        {project.link.label}
                    </span>
                </div>
            </div>

            <div className="relative min-h-52 md:min-h-0">
                <Accent
                    pattern={project.accent.pattern}
                    color={project.accent.color}
                    hovered={hovered}
                    className={`absolute inset-0 origin-bottom-right [mask-image:linear-gradient(to_right,transparent,black_35%)] motion-safe:transition-transform duration-700 ease-out group-hover:scale-105 ${
                        project.shot ? "opacity-70" : ""
                    }`}
                />
                {project.shot && (
                    <img
                        src={project.shot}
                        alt={`${project.name} screenshot`}
                        loading="lazy"
                        className="absolute left-8 md:left-[14%] top-10 md:top-14 w-[130%] md:w-[108%] max-w-none rounded-tl-md shadow-(--shadow-float) motion-safe:transition-transform duration-500 ease-out group-hover:-translate-y-1"
                    />
                )}
            </div>
        </a>
    );
}
