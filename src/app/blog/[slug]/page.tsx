import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { coverUrl, formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";
import Toc, { TocList } from "@/components/toc";
import Subscribe from "@/components/subscribe";
import { PUBLICATION } from "@/lib/site";

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
    const suffix = post.publication === "bitrot" ? PUBLICATION.name : "Alex Klos";
    return {
        title: `${post.title} | ${suffix}`,
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

    /* a publication post wears the publication's type and ends with its
       subscribe box; a plain post is set in the site's own */
    const branded = post.publication === "bitrot";

    return (
        <main
            className={`relative max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-24 ${
                branded ? "theme-bitrot text-ink" : ""
            }`}
        >
            {post.toc && post.toc.length > 0 && (
                <aside className="hidden xl:block absolute left-full top-0 h-full w-56 ml-12">
                    <div className="sticky top-10 pt-24">
                        <Toc entries={post.toc} />
                    </div>
                </aside>
            )}
            <Link
                href={branded ? PUBLICATION.path : "/blog"}
                className="text-sm text-muted hover:text-ink transition-colors"
            >
                {branded ? PUBLICATION.name : "Blog"}
            </Link>
            {branded ? (
                <h1 className="font-display text-6xl md:text-7xl uppercase text-balance leading-[0.92] mt-6 mb-5">
                    {post.title}
                </h1>
            ) : (
                <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-balance leading-[1.05] mt-6 mb-5">
                    {post.title}
                </h1>
            )}
            <p className="text-sm text-muted mb-12">
                <span className="capitalize">{post.section}</span>,{" "}
                {formatDate(post.date)} &middot; {post.readingMinutes} min
                read
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
                        className="w-full h-auto"
                    />
                    {post.coverCredit && (
                        <figcaption className="text-xs text-muted mt-3">
                            Photo by{" "}
                            <a
                                href={post.coverCreditUrl ?? undefined}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-ink transition-colors"
                            >
                                {post.coverCredit}
                            </a>{" "}
                            on{" "}
                            <a
                                href="https://unsplash.com/?utm_source=alexklos&utm_medium=referral"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-ink transition-colors"
                            >
                                Unsplash
                            </a>
                        </figcaption>
                    )}
                </figure>
            )}

            {post.toc && post.toc.length > 0 && (
                <details className="xl:hidden -mt-4 mb-12">
                    <summary className="cursor-pointer text-sm text-muted hover:text-ink transition-colors">
                        On this page
                    </summary>
                    <div className="mt-4 text-sm">
                        <TocList entries={post.toc} />
                    </div>
                </details>
            )}

            <article
                className="prose prose-lg prose-headings:font-semibold prose-headings:tracking-tight max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {branded && (
                <div className="mt-20">
                    <Subscribe />
                </div>
            )}
        </main>
    );
}
