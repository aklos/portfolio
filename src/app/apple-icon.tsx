import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

/* Home-screen icon; iOS rounds the corners itself. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
    const font = fs.readFileSync(
        path.join(process.cwd(), "src/assets/schibsted-grotesk-semibold.ttf"),
    );
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#141414",
                    color: "#f4f4f4",
                    fontFamily: "Schibsted",
                    fontSize: 96,
                    letterSpacing: -4,
                    paddingBottom: 6,
                }}
            >
                AK
            </div>
        ),
        { ...size, fonts: [{ name: "Schibsted", data: font, weight: 600 }] },
    );
}
