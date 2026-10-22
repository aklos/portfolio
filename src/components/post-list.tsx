import Link from "next/link";
import { coverUrl, formatDate, type PostMeta } from "@/lib/blog";
import { PUBLICATION } from "@/lib/site";

/* Posts as a plain list: publication (if any), section and date, title,
   description, with the cover as a small thumbnail when there is one. Rows
   fill on hover. */
export function PostRow({ post }: { post: PostMeta }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex items-center justify-between gap-6 -mx-4 px-4 py-4 rounded-md hover:bg-mist transition-colors"
        >
            <div className="min-w-0">
                <p className="text-xs text-muted">
                    {post.publication === "bitrot" && (
                        <>
                            <span className="text-ink">{PUBLICATION.name}</span>
                            {" · "}
                        </>
                    )}
                    <span className="capitalize">{post.section}</span>
                    {" · "}
                    {formatDate(post.date, true)}
                    {" · "}
                    {post.readingMinutes} min
                </p>
                <p className="text-lg font-semibold tracking-tight leading-snug mt-1">
                    {post.title}
                </p>
                <p className="text-sm text-muted mt-1">{post.description}</p>
            </div>
            {post.cover && (
                <img
                    src={coverUrl(post.cover)}
                    alt=""
                    loading="lazy"
                    className="shrink-0 w-28 h-[4.5rem] rounded-sm object-cover hidden sm:block"
                />
            )}
        </Link>
    );
}

export default function PostList({ posts }: { posts: PostMeta[] }) {
    return (
        <div className="flex flex-col">
            {posts.map((post) => (
                <PostRow key={post.slug} post={post} />
            ))}
        </div>
    );
}
