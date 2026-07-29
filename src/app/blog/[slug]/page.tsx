import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { coverUrl, formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";
import Toc, { TocList } from "@/components/toc";

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
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
        },
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
            <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-24">
                {post.toc && post.toc.length > 0 && (
                    <aside className="hidden 2xl:block absolute left-full top-0 h-full w-64 ml-12">
                        <div className="sticky top-10 pt-1">
                            <Toc entries={post.toc} />
                        </div>
                    </aside>
                )}
                <Link
                    href="/blog"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-blue transition-colors"
                >
                    <FiArrowLeft className="text-base motion-safe:transition-transform duration-200 group-hover:-translate-x-0.5 text-orange" />
                    Blog
                </Link>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-2">
                    {post.title}
                </h1>
                <p className="font-mono text-xs text-muted mb-8">
                    {formatDate(post.date)}
                </p>

                {post.cover && (
                    <figure className="mb-12">
                        {/* dimensions are fixed by the cover pipeline, so they
                            reserve space and avoid layout shift */}
                        <img
                            src={coverUrl(post.cover)}
                            alt={post.coverAlt ?? ""}
                            width={1456}
                            height={1048}
                            className="w-full h-auto rounded-lg border border-line"
                        />
                        {post.coverCredit && (
                            <figcaption className="font-mono text-xs text-muted mt-3">
                                Photo by{" "}
                                <a
                                    href={post.coverCreditUrl ?? undefined}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-blue transition-colors"
                                >
                                    {post.coverCredit}
                                </a>{" "}
                                on{" "}
                                <a
                                    href="https://unsplash.com/?utm_source=alexklos&utm_medium=referral"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-blue transition-colors"
                                >
                                    Unsplash
                                </a>
                            </figcaption>
                        )}
                    </figure>
                )}

                {post.toc && post.toc.length > 0 && (
                    <details className="2xl:hidden -mt-6 mb-12">
                        <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-muted hover:text-blue transition-colors">
                            On this page
                        </summary>
                        <div className="mt-4 text-sm">
                            <TocList entries={post.toc} />
                        </div>
                    </details>
                )}

                <article
                    className="prose prose-xl prose-headings:font-display max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
}
