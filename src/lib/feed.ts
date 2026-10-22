import { getPostBySlug, type PostMeta } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

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

/* One RSS channel. The whole blog and the publication each get one, built
   from a different list of posts. */
export async function buildFeed({
    title,
    description,
    link,
    self,
    posts,
}: {
    title: string;
    description: string;
    /* site paths, e.g. "/blog" and "/feed.xml" */
    link: string;
    self: string;
    posts: PostMeta[];
}): Promise<Response> {
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
        `        <title>${escape(title)}</title>`,
        `        <link>${SITE_URL}${link}</link>`,
        `        <description>${escape(description)}</description>`,
        "        <language>en</language>",
        `        <atom:link href="${SITE_URL}${self}" rel="self" type="application/rss+xml" />`,
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
