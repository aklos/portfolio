import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};
    return {
        title: `${post.title} — Alex Klos`,
        description: post.description,
    };
}

export default async function BlogPost({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 pb-24">
                <h1 className="font-[family-name:var(--font-serif)] text-3xl font-semibold mb-1 text-[var(--color-patent-fg)] dark:text-[var(--color-patent-dark-fg)]">
                    {post.title}
                </h1>
                <p className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] mb-12">
                    {post.date}
                </p>

                <hr className="border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)] mb-12" />

                <article
                    className="prose dark:prose-invert prose-headings:font-[family-name:var(--font-serif)] prose-h2:text-xl prose-h2:font-medium prose-a:text-[var(--color-patent-accent)] dark:prose-a:text-[var(--color-patent-dark-accent)] max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
}
