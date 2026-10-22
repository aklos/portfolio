import type { Metadata } from "next";
import { getPublicationPosts } from "@/lib/blog";
import { PUBLICATION } from "@/lib/site";
import PostList from "@/components/post-list";
import PublicationHero from "@/components/publication-hero";

export const metadata: Metadata = {
    title: `${PUBLICATION.name} | Alex Klos`,
    description: PUBLICATION.tagline,
    openGraph: {
        title: PUBLICATION.name,
        description: PUBLICATION.tagline,
        url: PUBLICATION.path,
        images: [{ url: "/bitrot-og.jpg", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: PUBLICATION.name,
        description: PUBLICATION.tagline,
        images: ["/bitrot-og.jpg"],
    },
    alternates: {
        types: {
            "application/rss+xml": [
                { url: PUBLICATION.feed, title: PUBLICATION.name },
            ],
        },
    },
};

/* The publication's home: its cover as the hero, then its posts. Only posts
   carrying `publication: bitrot` appear here; the rest of the blog lives a
   level up. */
export default function PublicationIndex() {
    const posts = getPublicationPosts();

    return (
        <main className="theme-bitrot text-ink max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-24">
            <div className="mb-16">
                <PublicationHero />
            </div>

            <PostList posts={posts} />
        </main>
    );
}
