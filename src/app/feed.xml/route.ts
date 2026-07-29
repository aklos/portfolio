import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function escape(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/* ]]> would close the section early, so split it across two CDATA blocks */
function cdata(value: string): string {
    return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
    const posts = getAllPosts();

    const items = await Promise.all(
        posts.map(async (meta) => {
            const post = await getPostBySlug(meta.slug);
            const url = `${SITE_URL}/blog/${meta.slug}`;
            const pubDate = new Date(`${meta.date}T00:00:00Z`).toUTCString();

            return [
                "        <item>",
                `            <title>${escape(meta.title)}</title>`,
                `            <link>${url}</link>`,
                `            <guid isPermaLink="true">${url}</guid>`,
                `            <pubDate>${pubDate}</pubDate>`,
                `            <description>${escape(meta.description)}</description>`,
                `            <category>${escape(meta.section)}</category>`,
                post
                    ? `            <content:encoded>${cdata(post.content)}</content:encoded>`
                    : "",
                "        </item>",
            ]
                .filter(Boolean)
                .join("\n");
        }),
    );

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
        "    <channel>",
        `        <title>${escape(SITE_TITLE)}</title>`,
        `        <link>${SITE_URL}</link>`,
        `        <description>${escape(SITE_DESCRIPTION)}</description>`,
        "        <language>en</language>",
        `        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
        ...items,
        "    </channel>",
        "</rss>",
    ].join("\n");

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
