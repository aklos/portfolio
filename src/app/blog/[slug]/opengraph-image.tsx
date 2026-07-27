import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post";

export function generateStaticParams() {
    return getAllPosts().map((post) => ({ slug: post.slug }));
}

/* light theme colors from globals.css — cards render the same for everyone */
const paper = "#ffffff";
const ink = "#16324f";
const orange = "#f07f23";
const blue = "#2d6bd8";
const muted = "#5d7290";

function wavePath(width: number, height: number) {
    const mid = height / 2;
    const half = 12;
    let d = `M0 ${mid} Q ${half / 2} 0, ${half} ${mid}`;
    for (let x = half * 2; x <= width + half; x += half) {
        d += ` T ${x} ${mid}`;
    }
    return d;
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    const leagueSpartan = fs.readFileSync(
        path.join(process.cwd(), "src/assets/league-spartan-bold.ttf"),
    );
    const dmMono = fs.readFileSync(
        path.join(process.cwd(), "src/assets/dm-mono-regular.ttf"),
    );
    const mulish = fs.readFileSync(
        path.join(process.cwd(), "src/assets/mulish-regular.ttf"),
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
                            fontFamily: "League Spartan",
                            fontSize: 38,
                            color: ink,
                        }}
                    >
                        Alex Klos
                    </div>
                    <svg width="136" height="12" viewBox="0 0 136 12">
                        <path
                            d={wavePath(136, 12)}
                            stroke={orange}
                            strokeWidth="2.5"
                            fill="none"
                        />
                    </svg>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontFamily: "League Spartan",
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
                                fontFamily: "Mulish",
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
                            fontFamily: "DM Mono",
                            fontSize: 26,
                            color: muted,
                        }}
                    >
                        {date}
                    </div>
                    <div
                        style={{
                            fontFamily: "DM Mono",
                            fontSize: 26,
                            color: blue,
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
                    name: "League Spartan",
                    data: leagueSpartan,
                    weight: 700,
                    style: "normal",
                },
                {
                    name: "DM Mono",
                    data: dmMono,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Mulish",
                    data: mulish,
                    weight: 400,
                    style: "normal",
                },
            ],
        },
    );
}
