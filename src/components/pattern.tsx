"use client";

import { useId } from "react";

type Variant = "dots" | "stripes" | "wave";

/*
 * Decorative geometric fill. Size it externally (e.g. `absolute inset-0`)
 * and color it with a text-* class — the pattern draws in currentColor.
 */
export default function Pattern({
    variant,
    className = "",
}: {
    variant: Variant;
    className?: string;
}) {
    const id = useId();

    return (
        <svg width="100%" height="100%" className={className} aria-hidden="true">
            <defs>
                {variant === "dots" && (
                    <pattern
                        id={id}
                        width="12"
                        height="12"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="3" cy="3" r="2" fill="currentColor" />
                        <circle cx="9" cy="9" r="2" fill="currentColor" />
                    </pattern>
                )}
                {variant === "stripes" && (
                    <pattern
                        id={id}
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                    >
                        <rect width="4" height="8" fill="currentColor" />
                    </pattern>
                )}
                {variant === "wave" && (
                    <pattern
                        id={id}
                        width="12"
                        height="6"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M0 3 Q3 0 6 3 T12 3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </pattern>
                )}
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}
