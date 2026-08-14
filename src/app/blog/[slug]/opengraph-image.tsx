import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { coverFilePath, formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post";

export function generateStaticParams() {
    return getAllPosts().map((post) => ({ slug: post.slug }));
}

/* light theme colors from globals.css — cards render the same for everyone */
const paper = "#f6f6f4";
const ink = "#16181c";
const emulsion = "#a8551f";
const signal = "#1568b8";
const muted = "#666b72";

/* the decay bit-stream from the site header: blocks thinning out into
   dropouts (0 = a gap in the stream) */
const decayBits = [1, 1, 0.85, 0, 0.7, 0.55, 0, 0.4, 0.25, 0, 0.12];

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    /* A chosen cover always wins: the generated card below is the fallback for
       posts that don't have one. Covers are authored at Substack's 1456x1048
       and cropped to the 1.91:1 social slot here. */
    if (post?.cover) {
        const file = coverFilePath(post.cover);
        if (fs.existsSync(file)) {
            const ext = path.extname(file).toLowerCase();
            const mime = ext === ".png" ? "image/png" : "image/jpeg";
            const data = fs.readFileSync(file).toString("base64");

            return new ImageResponse(
                (
                    <div style={{ display: "flex", width: "100%", height: "100%" }}>
                        <img
                            src={`data:${mime};base64,${data}`}
                            width={size.width}
                            height={size.height}
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                ),
                size,
            );
        }
    }

    const bricolage = fs.readFileSync(
        path.join(process.cwd(), "src/assets/bricolage-grotesque-bold.ttf"),
    );
    const plexMono = fs.readFileSync(
        path.join(process.cwd(), "src/assets/ibm-plex-mono-regular.ttf"),
    );
    const plexSans = fs.readFileSync(
        path.join(process.cwd(), "src/assets/ibm-plex-sans-regular.ttf"),
    );

    const title = post?.title ?? "Alex Klos";
    const description = post?.description ?? "";
    const date = post ? formatDate(post.date) : "";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: paper,
                    padding: "72px 80px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontFamily: "Bricolage Grotesque",
                            fontSize: 38,
                            color: ink,
                        }}
                    >
                        Alex Klos
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                        {decayBits.map((bit, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: emulsion,
                                    opacity: bit,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontFamily: "Bricolage Grotesque",
                            fontSize: title.length > 45 ? 60 : 76,
                            color: ink,
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            maxWidth: 1000,
                        }}
                    >
                        {title}
                    </div>
                    {description && (
                        <div
                            style={{
                                fontFamily: "IBM Plex Sans",
                                fontSize: 32,
                                color: muted,
                                lineHeight: 1.4,
                                maxWidth: 960,
                                marginTop: 24,
                            }}
                        >
                            {description}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "IBM Plex Mono",
                            fontSize: 26,
                            color: muted,
                        }}
                    >
                        {date}
                    </div>
                    <div
                        style={{
                            fontFamily: "IBM Plex Mono",
                            fontSize: 26,
                            color: signal,
                        }}
                    >
                        Blog
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "Bricolage Grotesque",
                    data: bricolage,
                    weight: 700,
                    style: "normal",
                },
                {
                    name: "IBM Plex Mono",
                    data: plexMono,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "IBM Plex Sans",
                    data: plexSans,
                    weight: 400,
                    style: "normal",
                },
            ],
        },
    );
}
