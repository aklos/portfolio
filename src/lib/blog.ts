import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
}

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): Omit<Post, "content">[] {
    const filenames = fs.readdirSync(postsDirectory);

    const posts = filenames
        .filter((name) => name.endsWith(".md"))
        .map((filename) => {
            const slug = filename.replace(/\.md$/, "");
            const filePath = path.join(postsDirectory, filename);
            const fileContents = fs.readFileSync(filePath, "utf8");
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
                date: data.date,
                description: data.description,
            };
        });

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

    const result = await remark().use(html).process(markdownContent);

    return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content: result.toString(),
    };
}
