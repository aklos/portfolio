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

/* dark theme colors from globals.css; cards render the same for everyone */
const paper = "#0f1112";
const ink = "#f2e6d3";
const muted = "#8f918f";
/* and the site's own, for posts outside the publication */
const sitePaper = "#141414";
const siteInk = "#f4f4f4";
const siteMuted = "#8c8c8c";

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

    const schibsted = fs.readFileSync(
        path.join(process.cwd(), "src/assets/schibsted-grotesk.ttf"),
    );

    /* a plain post gets the site's card: title in the site's type on the
       dark ground, like the site card itself */
    if (post && post.publication !== "bitrot") {
        const semibold = fs.readFileSync(
            path.join(process.cwd(), "src/assets/schibsted-grotesk-semibold.ttf"),
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
                        background: sitePaper,
                        color: siteInk,
                        fontFamily: "Schibsted Grotesk",
                    }}
                >
                    <div style={{ fontSize: 30, fontWeight: 600 }}>Alex Klos</div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                fontSize: post.title.length > 40 ? 64 : 80,
                                fontWeight: 600,
                                letterSpacing: -3,
                                lineHeight: 1.05,
                            }}
                        >
                            {post.title}
                        </div>
                        {post.description && (
                            <div
                                style={{
                                    fontSize: 28,
                                    color: siteMuted,
                                    lineHeight: 1.4,
                                    marginTop: 20,
                                }}
                            >
                                {post.description}
                            </div>
                        )}
                    </div>
                    <div style={{ fontSize: 26, color: siteMuted }}>
                        {formatDate(post.date)}
                    </div>
                </div>
            ),
            {
                ...size,
                fonts: [
                    { name: "Schibsted Grotesk", data: schibsted, weight: 400 },
                    { name: "Schibsted Grotesk", data: semibold, weight: 600 },
                ],
            },
        );
    }

    const bebas = fs.readFileSync(
        path.join(process.cwd(), "src/assets/bebas-neue.ttf"),
    );
    const art = fs
        .readFileSync(path.join(process.cwd(), "src/assets/bitrot-art.jpg"))
        .toString("base64");

    const title = post?.title ?? "Bit Rot";
    const description = post?.description ?? "";
    const date = post
        ? `${post.section[0].toUpperCase()}${post.section.slice(1)}, ${formatDate(post.date)}`
        : "";

    /* text on the left, the 630px-square cover art (which carries the
       wordmark) on the right */
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    backgroundColor: paper,
                }}
            >
                <div
                    style={{
                        width: 570,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "64px 56px 52px",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                fontFamily: "Bebas Neue",
                                fontSize: title.length > 40 ? 72 : 86,
                                color: ink,
                                lineHeight: 0.95,
                                textTransform: "uppercase",
                            }}
                        >
                            {title}
                        </div>
                        {description && (
                            <div
                                style={{
                                    fontFamily: "Schibsted Grotesk",
                                    fontWeight: 400,
                                    fontSize: 24,
                                    color: muted,
                                    lineHeight: 1.4,
                                    marginTop: 18,
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
                            fontFamily: "Schibsted Grotesk",
                            fontWeight: 400,
                            fontSize: 20,
                            color: muted,
                        }}
                    >
                        <span>{date}</span>
                        <span>Alex Klos</span>
                    </div>
                </div>
                <img
                    src={`data:image/jpeg;base64,${art}`}
                    width={630}
                    height={630}
                />
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "Bebas Neue",
                    data: bebas,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Schibsted Grotesk",
                    data: schibsted,
                    weight: 400,
                    style: "normal",
                },
            ],
        },
    );
}
