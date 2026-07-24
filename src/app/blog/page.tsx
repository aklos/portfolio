import Link from "next/link";
import type { Metadata } from "next";
import { formatDate, getAllPosts } from "@/lib/blog";
import SectionHeading from "@/components/section-heading";

export const metadata: Metadata = {
    title: "Blog — Alex Klos",
    description: "Writing about software engineering, projects, and more.",
};

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen">
            <section className="max-w-4xl mx-auto px-6 pt-10 pb-24">
                <SectionHeading
                    title="Blog"
                    sub="Writing about software and more"
                />

                <div className="border-t border-line">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex items-baseline justify-between gap-4 py-5 border-b border-line"
                        >
                            <div className="min-w-0">
                                <span className="font-display text-lg font-bold group-hover:text-blue transition-colors block truncate">
                                    {post.title}
                                </span>
                                <span className="text-sm text-muted truncate block mt-0.5">
                                    {post.description}
                                </span>
                            </div>
                            <span className="font-mono text-xs text-muted shrink-0">
                                {formatDate(post.date)}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
