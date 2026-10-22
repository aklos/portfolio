import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { PUBLICATION, SITE_DESCRIPTION } from "@/lib/site";
import PostList from "@/components/post-list";
import { SubscribeButton } from "@/components/subscribe";

export const metadata: Metadata = {
    title: "Blog | Alex Klos",
    description: SITE_DESCRIPTION,
};

/* Everything written, newest first, with the publication introduced above
   the list. Posts that belong to it are marked in their rows and link
   through to its own page. */
export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <main className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-24">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10">
                Blog
            </h1>

            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-md bg-mist p-5 mb-12">
                <Link href={PUBLICATION.path} className="group flex items-center gap-4">
                    <img
                        src="/bitrot.webp"
                        alt={PUBLICATION.name}
                        width={1600}
                        height={1600}
                        className="size-14 rounded-md object-cover object-top shrink-0"
                    />
                    <div>
                        <p className="font-semibold tracking-tight group-hover:text-teal transition-colors">
                            {PUBLICATION.name}
                        </p>
                        <p className="text-sm text-muted mt-0.5">
                            {PUBLICATION.tagline} Free by email.
                        </p>
                    </div>
                </Link>
                <SubscribeButton />
            </section>

            <PostList posts={posts} />
        </main>
    );
}
