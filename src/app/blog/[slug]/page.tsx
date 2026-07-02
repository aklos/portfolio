import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
            <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">
                <Link
                    href="/blog"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
                >
                    <FiArrowLeft className="text-base motion-safe:transition-transform duration-200 group-hover:-translate-x-0.5 text-orange" />
                    Blog
                </Link>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-2">
                    {post.title}
                </h1>
                <p className="font-mono text-xs text-muted mb-12">
                    {post.date}
                </p>

                <article
                    className="prose prose-headings:font-display prose-h2:text-xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
}
