import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
    title: "Blog — Alex Klos",
    description: "Writing about software engineering, projects, and more.",
};

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen">
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold mb-1 text-[var(--color-patent-fg)] dark:text-[var(--color-patent-dark-fg)]">
                    Blog
                </h2>
                <p className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] mb-8">
                    Writing about software and more
                </p>

                <div className="border-t border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)]">
                    {posts.map((post, i) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex items-baseline justify-between py-4 border-b border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)] hover:pl-2 transition-all duration-200"
                        >
                            <div className="flex items-baseline gap-4 min-w-0">
                                <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] tabular-nums shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0">
                                    <span className="font-[family-name:var(--font-serif)] font-medium group-hover:text-[var(--color-patent-accent)] dark:group-hover:text-[var(--color-patent-dark-accent)] transition-colors truncate block">
                                        {post.title}
                                    </span>
                                    <span className="hidden sm:block text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] truncate">
                                        {post.description}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] tabular-nums shrink-0 ml-4">
                                {post.date}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
