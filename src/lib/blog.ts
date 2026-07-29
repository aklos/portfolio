import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { remark } from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

export interface TocEntry {
    id: string;
    text: string;
    depth: number;
}

export type Section = "tech" | "culture" | "fiction";
export type Channel = "site" | "substack" | "linkedin";

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    /* which Substack section this belongs to */
    section: Section;
    /* where this gets published; fiction is typically substack-only */
    channels: Channel[];
    /* filename under public/covers, e.g. "koala.jpg" */
    cover: string | null;
    coverAlt: string | null;
    /* Unsplash requires the photographer be credited wherever the photo runs */
    coverCredit: string | null;
    coverCreditUrl: string | null;
}

export interface Post extends PostMeta {
    content: string;
    toc: TocEntry[] | null;
}

const postsDirectory = path.join(process.cwd(), "src/content/blog");
const coversDirectory = path.join(process.cwd(), "public/covers");

export function coverUrl(cover: string): string {
    return `/covers/${cover}`;
}

export function coverFilePath(cover: string): string {
    return path.join(coversDirectory, cover);
}

/* Frontmatter is hand-written, so every field beyond the original four is
   optional and defaults to the pre-syndication behaviour: a tech post that
   only ever appeared on the site. */
function parseMeta(slug: string, data: Record<string, any>): PostMeta {
    return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        section: data.section ?? "tech",
        channels: data.channels ?? ["site"],
        cover: data.cover ?? null,
        coverAlt: data.coverAlt ?? null,
        coverCredit: data.coverCredit ?? null,
        coverCreditUrl: data.coverCreditUrl ?? null,
    };
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

function nodeText(node: any): string {
    if (node.type === "text" || node.type === "inlineCode") return node.value;
    return (node.children ?? []).map(nodeText).join("");
}

/* Mirrors rehype-slug: github-slugger over heading text, in document order,
   so anchor ids and TOC ids stay in sync */
function extractToc(markdown: string): TocEntry[] {
    const tree = remark().use(gfm).parse(markdown);
    const slugger = new GithubSlugger();
    const toc: TocEntry[] = [];

    for (const node of tree.children) {
        if (node.type !== "heading") continue;
        const text = nodeText(node);
        const id = slugger.slug(text);
        if (node.depth === 2 || node.depth === 3) {
            toc.push({ id, text, depth: node.depth });
        }
    }

    return toc;
}

/* Defaults to the site so existing callers keep rendering only what belongs
   on alexklos.ca; the syndication script asks for "substack" or "linkedin". */
export function getAllPosts(channel: Channel = "site"): PostMeta[] {
    const filenames = fs.readdirSync(postsDirectory);

    const posts = filenames
        .filter((name) => name.endsWith(".md"))
        .map((filename) => {
            const slug = filename.replace(/\.md$/, "");
            const filePath = path.join(postsDirectory, filename);
            const fileContents = fs.readFileSync(filePath, "utf8");
            const { data } = matter(fileContents);

            return parseMeta(slug, data);
        })
        .filter((post) => post.channels.includes(channel));

    return posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const filePath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(fileContents);

    const result = await remark()
        .use(gfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(markdownContent);

    return {
        ...parseMeta(slug, data),
        content: result.toString(),
        toc: data.toc ? extractToc(markdownContent) : null,
    };
}
