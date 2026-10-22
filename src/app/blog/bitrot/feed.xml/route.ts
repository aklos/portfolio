import { getPublicationPosts } from "@/lib/blog";
import { buildFeed } from "@/lib/feed";
import { PUBLICATION } from "@/lib/site";

export const dynamic = "force-static";

/* only the publication's posts */
export function GET() {
    return buildFeed({
        title: PUBLICATION.name,
        description: PUBLICATION.tagline,
        link: PUBLICATION.path,
        self: PUBLICATION.feed,
        posts: getPublicationPosts(),
    });
}
