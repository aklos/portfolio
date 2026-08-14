"use client";

import { useId } from "react";

type Variant = "dither" | "scanlines" | "decay";

/*
 * Decorative fill in the Bitrot idiom — decayed data, not confetti.
 * Size it externally (e.g. `absolute inset-0`) and color it with a
 * text-* class — the pattern draws in currentColor.
 *
 *   dither    — ordered Bayer-matrix halftone: an image decaying into cells
 *   scanlines — thin horizontal raster lines
 *   decay     — a 6px bit-stream with dropouts; tiles every 12px so the
 *               12px `animate-wave` translation loops seamlessly
 */

/* 4x4 Bayer matrix; cell opacity follows the threshold order */
const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
];

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
                {variant === "dither" && (
                    <pattern
                        id={id}
                        width="16"
                        height="16"
                        patternUnits="userSpaceOnUse"
                    >
                        {BAYER.flatMap((row, y) =>
                            row.map((v, x) => (
                                <rect
                                    key={`${x}-${y}`}
                                    x={x * 4}
                                    y={y * 4}
                                    width="3"
                                    height="3"
                                    fill="currentColor"
                                    opacity={(v + 1) / 16}
                                />
                            )),
                        )}
                    </pattern>
                )}
                {variant === "scanlines" && (
                    <pattern
                        id={id}
                        width="8"
                        height="3"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="8" height="1.25" fill="currentColor" />
                    </pattern>
                )}
                {variant === "decay" && (
                    <pattern
                        id={id}
                        width="12"
                        height="6"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect x="0" y="1.5" width="3" height="3" fill="currentColor" />
                        <rect
                            x="6"
                            y="1.5"
                            width="3"
                            height="3"
                            fill="currentColor"
                            opacity="0.45"
                        />
                        <rect
                            x="9.5"
                            y="4"
                            width="1.5"
                            height="1.5"
                            fill="currentColor"
                            opacity="0.25"
                        />
                    </pattern>
                )}
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}
