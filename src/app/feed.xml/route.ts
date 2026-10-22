import { getAllPosts } from "@/lib/blog";
import { buildFeed } from "@/lib/feed";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const dynamic = "force-static";

/* everything on the blog; the publication has its own feed under its page */
export function GET() {
    return buildFeed({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        link: "/blog",
        self: "/feed.xml",
        posts: getAllPosts(),
    });
}
