import { PUBLICATION } from "@/lib/site";
import { SubscribeButton } from "@/components/subscribe";

/* The publication's banner: its cover, which carries the wordmark, with the
   tagline and the subscribe action in the lower part. On wide screens the
   cover fades out into the page over its lower half, so there is no box,
   and the text sits in the faded region on the page's own ground. On
   phones the square cover stacks above the text. The heading is for screen
   readers and search only.

   `aspect` is the wide cover's crop: 16:9 on the publication's own page,
   shorter where it is a feature on another page. */
export default function PublicationHero({
    aspect = "sm:aspect-video",
    heading = "h1",
}: {
    aspect?: string;
    heading?: "h1" | "h2";
}) {
    const Heading = heading;
    return (
        <section className="theme-bitrot text-ink relative">
            <picture>
                <source media="(min-width: 640px)" srcSet="/bitrot-wide.webp" />
                <img
                    src="/bitrot.webp"
                    alt={`${PUBLICATION.name} cover: a hand melting away to the circuitry underneath`}
                    width={1600}
                    height={1600}
                    className={`block w-full rounded-md sm:rounded-b-none object-cover sm:hero-fade ${aspect}`}
                />
            </picture>
            <div className="relative sm:absolute sm:inset-x-0 sm:bottom-0 pt-6 sm:p-6 md:p-8 md:pb-2">
                <Heading className="sr-only">{PUBLICATION.name}</Heading>
                <p className="text-2xl md:text-3xl font-semibold tracking-tight text-balance max-w-lg">
                    {PUBLICATION.tagline}
                </p>
                <p className="text-sm md:text-base opacity-80 mt-2 mb-5">
                    Free, via Substack.
                </p>
                <SubscribeButton />
            </div>
        </section>
    );
}
