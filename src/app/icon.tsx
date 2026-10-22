import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

/* The favicon: the initials on the site's dark ground, so it matches the
   tab bar whichever theme the visitor picked. favicon.ico beside this file
   is the same mark rendered for browsers that only ask for that. */
export const size = { width: 64, height: 64 };
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
                    borderRadius: 12,
                    color: "#f4f4f4",
                    fontFamily: "Schibsted",
                    fontSize: 34,
                    letterSpacing: -1.5,
                    paddingBottom: 2,
                }}
            >
                AK
            </div>
        ),
        { ...size, fonts: [{ name: "Schibsted", data: font, weight: 600 }] },
    );
}
