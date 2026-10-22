"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

/*
 * Geometric accents for the project cards, one per project, each a
 * construction tied to what the project does. Drawn on a canvas with p5 in
 * instance mode, in the card's accent colour. At rest a sketch is a still
 * frame; it animates, slowly, only while the card is hovered, and never
 * when the visitor prefers reduced motion.
 *
 *   concentric rings radiating from a point, each broken by gaps; the rings
 *              drift outward and the gaps turn
 *   halftone   a dot screen dissolving from one corner; the front creeps
 *   lattice    a hex grid with a route lit through it; the route traces
 *   waves      stacked wave profiles, heavier toward the bottom; they roll
 *   orbits     nested tilted orbits round a point, one craft on each; they
 *              move along their orbits
 */

export type Pattern = "concentric" | "halftone" | "lattice" | "waves" | "orbits";

/* each sketch draws one frame for time t (seconds of hover) */
type Sketch = (p: p5, color: string) => (t: number) => void;

const concentric: Sketch = (p, color) => {
    /* rings radiating from a centre low on the right, each broken by a
       few gaps so they read as dials rather than a target; on hover the
       rings drift outward and the gaps turn */
    const gap = 20;
    const breaks = Array.from({ length: 48 }, (_, i) => ({
        a: p.random(Math.PI * 2),
        w: p.random(0.12, 0.5),
        spin: p.random(-0.08, 0.08),
        n: i % 3 === 0 ? 2 : 1,
    }));
    return (t) => {
        p.clear();
        const c = p.color(color);
        const cx = p.width * 0.78;
        const cy = p.height * 0.88;
        const max = Math.hypot(cx, cy) + gap;
        const drift = (t * 4) % gap;
        p.noFill();
        p.strokeCap(p.SQUARE);
        for (let i = 0; i * gap + drift < max; i++) {
            const r = i * gap + drift + 6;
            const fade = 1 - r / max;
            const major = i % 4 === 0;
            c.setAlpha((major ? 190 : 100) * (0.55 + 0.45 * fade));
            p.stroke(c);
            p.strokeWeight(major ? 1.6 : 1);
            const b = breaks[i % breaks.length];
            /* draw the ring as arcs around its gaps */
            let a0 = b.a + t * b.spin;
            const span = (Math.PI * 2) / b.n;
            for (let k = 0; k < b.n; k++) {
                const s = a0 + k * span;
                p.arc(cx, cy, r * 2, r * 2, s + b.w, s + span);
            }
        }
        /* the centre */
        c.setAlpha(255);
        p.noStroke();
        p.fill(c);
        p.circle(cx, cy, 6);
    };
};

const halftone: Sketch = (p, color) => (t) => {
    p.clear();
    const c = p.color(color);
    c.setAlpha(190);
    p.noStroke();
    p.fill(c);
    const step = 13;
    const front = 0.2 + 0.12 * Math.sin(t * 0.5);
    for (let y = 6; y < p.height; y += step) {
        for (let x = 6; x < p.width; x += step) {
            const base = Math.min(1, (x / p.width) * 0.6 + (y / p.height) * 0.6);
            const n = p.noise(x * 0.05, y * 0.05, t * 0.15) - 0.5;
            const r = 5.6 * Math.max(0, base - front + n * 0.3);
            if (r > 0.4) p.circle(x, y, r * 2);
        }
    }
};

const lattice: Sketch = (p, color) => {
    const r = 17;
    const dx = r * Math.sqrt(3);
    const dy = r * 1.5;
    const hex = (cx: number, cy: number, rr: number) => {
        p.beginShape();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i + Math.PI / 6;
            p.vertex(cx + rr * Math.cos(a), cy + rr * Math.sin(a));
        }
        p.endShape(p.CLOSE);
    };
    return (t) => {
        p.clear();
        const c = p.color(color);
        const path = (x: number) =>
            p.height * 0.85 - x * 0.5 + Math.sin(x / 45 + t * 0.4) * 18;
        let row = 0;
        for (let y = 0; y < p.height + r; y += dy, row++) {
            for (let x = (row % 2) * (dx / 2); x < p.width + dx; x += dx) {
                c.setAlpha(60);
                p.noFill();
                p.stroke(c);
                p.strokeWeight(1);
                hex(x, y, r - 1.5);
                if (Math.abs(y - path(x)) < 14) {
                    const phase = 0.5 + 0.5 * Math.sin(x / 30 - t * 1.2);
                    c.setAlpha(120 + 135 * phase);
                    p.noStroke();
                    p.fill(c);
                    p.circle(x, y, 5 + phase * 3);
                }
            }
        }
    };
};

const waves: Sketch = (p, color) => (t) => {
    /* a stack of wave profiles, calmer at the top and heavier toward the
       bottom, rolling slowly to the right on hover */
    p.clear();
    const c = p.color(color);
    const rows = 16;
    p.noFill();
    for (let i = 0; i < rows; i++) {
        const f = i / (rows - 1);
        const y0 = p.height * (0.12 + 0.82 * f);
        const amp = 3 + 14 * f * f;
        c.setAlpha(50 + 160 * f);
        p.stroke(c);
        p.strokeWeight(f > 0.7 ? 1.4 : 1);
        p.beginShape();
        for (let x = -10; x <= p.width + 10; x += 6) {
            const k = x / 70 - t * 0.5;
            const y =
                y0 +
                Math.sin(k + i * 0.7) * amp +
                Math.sin(k * 2.3 - i * 0.4 + t * 0.3) * amp * 0.35 +
                (p.noise(x * 0.01, i * 0.3, t * 0.05) - 0.5) * amp * 0.8;
            p.vertex(x, y);
        }
        p.endShape();
    }
};

const orbits: Sketch = (p, color) => {
    const N = 7;
    const ring = Array.from({ length: N }, (_, i) => ({
        a: 70 + i * 48 + p.random(-8, 8),
        b: (0.32 + p.random(0.1)) * (70 + i * 48),
        tilt: -0.45 + p.random(-0.12, 0.12),
        phase: p.random(Math.PI * 2),
        speed: 0.28 / (1 + i * 0.35),
    }));
    return (t) => {
        p.clear();
        const c = p.color(color);
        const cx = p.width * 0.82;
        const cy = p.height * 0.9;
        p.noFill();
        for (const r of ring) {
            c.setAlpha(60);
            p.stroke(c);
            p.strokeWeight(1);
            p.push();
            p.translate(cx, cy);
            p.rotate(r.tilt);
            p.ellipse(0, 0, r.a * 2, r.b * 2);
            const ang = r.phase + t * r.speed;
            const x = Math.cos(ang) * r.a;
            const y = Math.sin(ang) * r.b;
            c.setAlpha(230);
            p.noStroke();
            p.fill(c);
            p.circle(x, y, 4);
            p.pop();
            p.noFill();
        }
        c.setAlpha(255);
        p.noStroke();
        p.fill(c);
        p.circle(cx, cy, 6);
    };
};

const sketches: Record<Pattern, Sketch> = { concentric, halftone, lattice, waves, orbits };

export default function Accent({
    pattern,
    color,
    hovered = false,
    className = "",
}: {
    pattern: Pattern;
    color: string;
    /* the sketch animates only while this is true */
    hovered?: boolean;
    className?: string;
}) {
    const host = useRef<HTMLDivElement>(null);
    const instance = useRef<p5 | null>(null);
    const reduced = useRef(false);

    useEffect(() => {
        const el = host.current;
        if (!el) return;
        reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let cancelled = false;

        import("p5").then(({ default: P5 }) => {
            if (cancelled) return;
            instance.current = new P5((p: p5) => {
                let frame: (t: number) => void;
                p.setup = () => {
                    p.createCanvas(el.clientWidth, el.clientHeight);
                    p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
                    p.frameRate(30);
                    p.noiseSeed(7);
                    p.randomSeed(7);
                    frame = sketches[pattern](p, color);
                    /* one frame at rest; the loop runs only on hover */
                    p.noLoop();
                };
                p.draw = () => frame(p.frameCount / 30);
                p.windowResized = () => {
                    p.resizeCanvas(el.clientWidth, el.clientHeight);
                    p.redraw();
                };
            }, el);
        });

        return () => {
            cancelled = true;
            instance.current?.remove();
            instance.current = null;
        };
    }, [pattern, color]);

    useEffect(() => {
        const inst = instance.current;
        if (!inst || reduced.current) return;
        if (hovered) inst.loop();
        else inst.noLoop();
    }, [hovered]);

    return <div ref={host} className={className} aria-hidden="true" />;
}
