import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

/* The site's share card: the hero line on the dark ground. */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Alex Klos: I build products, apps & games.";

export default function Image() {
    const semibold = fs.readFileSync(
        path.join(process.cwd(), "src/assets/schibsted-grotesk-semibold.ttf"),
    );
    const regular = fs.readFileSync(
        path.join(process.cwd(), "src/assets/schibsted-grotesk.ttf"),
    );
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 72,
                    background: "#141414",
                    color: "#f4f4f4",
                    fontFamily: "Schibsted",
                }}
            >
                <div style={{ fontSize: 30, fontWeight: 600 }}>Alex Klos</div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 104,
                        fontWeight: 600,
                        letterSpacing: -5,
                        lineHeight: 1.02,
                    }}
                >
                    <span>I build products,</span>
                    <span>apps &amp; games.</span>
                </div>
                <div style={{ fontSize: 30, color: "#8c8c8c" }}>alexklos.ca</div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: "Schibsted", data: regular, weight: 400 },
                { name: "Schibsted", data: semibold, weight: 600 },
            ],
        },
    );
}
