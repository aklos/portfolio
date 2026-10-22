import Link from "next/link";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import SectionHeading from "@/components/section-heading";
import ProjectCard, { type Project } from "@/components/project-card";
import PostList from "@/components/post-list";
import PublicationHero from "@/components/publication-hero";
import { getAllPosts } from "@/lib/blog";
import { EMAIL, PUBLICATION } from "@/lib/site";

/* Projects are products people use; tools are things built for other
   builders */
const projects: Project[] = [
    {
        name: "Space Truckers",
        kind: "Game",
        years: "2026–",
        desc: "A multiplayer space-trucking sim flown entirely from the cab. The Company deals you wrecks and dead stations out in the dark; you fly out, strip them, and keep whatever it didn't ask for.",
        stack: "Godot 4, C#",
        art: "/projects/space-truckers.webp",
        accent: { pattern: "orbits", color: "#e8742f" },
    },
    {
        name: "Kupigo",
        kind: "Platform",
        years: "2025–",
        desc: "Find a home on the Spanish coast and get introduced to one certified local agent who speaks your language. Browse listings, or describe what you want and let the guide narrow it down.",
        stack: "Next.js, Payload, OpenAI",
        shot: "/projects/kupigo.webp",
        accent: { pattern: "halftone", color: "#e8742f" },
        link: { label: "kupigo.net", href: "https://kupigo.net/" },
    },
];

const tools: Project[] = [
    {
        name: "Scryer",
        kind: "Desktop app",
        years: "2026–",
        desc: "Model-driven development for coding agents. Plan changes in a shared responsibility model mapped to your code; your agent implements it through a built-in MCP server.",
        stack: "Rust, Tauri, React",
        shot: "/projects/scryer.webp",
        accent: { pattern: "lattice", color: "#0293a7" },
        link: {
            label: "github.com/aklos/scryer",
            href: "https://github.com/aklos/scryer",
        },
    },
    {
        name: "FLIP Water Sim",
        kind: "Godot extension",
        years: "2024",
        desc: "2D FLIP fluid simulation for Godot 4, in C++.",
        stack: "C++, Godot 4",
        accent: { pattern: "waves", color: "#8b6cf0" },
        link: {
            label: "github.com/aklos/godot-flip-water-simulation",
            href: "https://github.com/aklos/godot-flip-water-simulation",
        },
    },
];

const socials = [
    { label: "GitHub", href: "https://github.com/aklos", Icon: AiFillGithub },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/alexander-klos-460787120",
        Icon: AiFillLinkedin,
    },
    { label: "X", href: "https://x.com/alexmklos", Icon: RiTwitterXFill },
];

export default function Home() {
    const latest = getAllPosts().slice(0, 3);

    return (
        <main className="relative max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-24">
            {/* the dot grid sits behind the intro only; it runs out of the
                content column on the right and is gone before the projects */}
            <div
                aria-hidden="true"
                className="dot-grid absolute -top-14 -right-24 md:-right-48 left-1/3 h-[34rem] -z-10 pointer-events-none"
            />
            {/* Intro */}
            <section className="mb-24">
                <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] leading-[1.02] text-balance mb-12">
                    Hi, I haven't written code
                    <br />
                    since December 2025.
                </h1>

                <div className="flex items-center gap-4 mb-6">
                    <img
                        src="/face.png"
                        alt="Alex Klos"
                        className="size-12 rounded-md object-cover"
                    />
                    <div>
                        <p className="font-semibold leading-tight">Alex Klos</p>
                        <div className="flex items-center gap-3 mt-1.5">
                            {socials.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="text-muted hover:text-ink transition-colors"
                                >
                                    <Icon className="text-base" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-muted text-lg leading-relaxed max-w-2xl mb-10 space-y-4">
                    <p>
                        The agents write most code now. I decide what to build.
                        Right now that&apos;s{" "}
                        <a
                            href="https://github.com/aklos/scryer"
                            className="text-ink font-medium hover:text-teal transition-colors"
                        >
                            Scryer
                        </a>
                        , which helps humans and agents understand what&apos;s
                        true about a codebase after blasting it with tokens, and
                        consultancy work. Before that, I was a software engineer
                        at Bulb and Motorway.
                    </p>
                    <p>
                        Software is the easy part. What AI does to everything
                        else in an already troubled society is what I write
                        about in{" "}
                        <Link
                            href={PUBLICATION.path}
                            className="text-ink font-medium hover:text-teal transition-colors"
                        >
                            {PUBLICATION.name}
                        </Link>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <a
                        href={`mailto:${EMAIL}`}
                        className="btn btn-primary group/btn"
                    >
                        Contact
                        <span
                            aria-hidden="true"
                            className="motion-safe:transition-transform group-hover/btn:translate-x-0.5"
                        >
                            &rarr;
                        </span>
                    </a>
                    <Link href={PUBLICATION.path} className="btn btn-secondary">
                        Read {PUBLICATION.name}
                    </Link>
                </div>
            </section>

            <section id="projects" className="mb-24 scroll-mt-20">
                <SectionHeading title="Projects" />
                <div className="flex flex-col gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))}
                </div>
            </section>

            <section id="tools" className="mb-24 scroll-mt-20">
                <SectionHeading title="Tools" />
                <div className="flex flex-col gap-4">
                    {tools.map((tool) => (
                        <ProjectCard key={tool.name} project={tool} />
                    ))}
                </div>
            </section>

            {/* the publication as the feature, then the latest posts from the
                whole blog */}
            <section id="blog" className="scroll-mt-20">
                <div className="mb-10">
                    <PublicationHero aspect="sm:aspect-[2/1]" heading="h2" />
                </div>
                <SectionHeading
                    title="Latest posts"
                    href="/blog"
                    linkLabel="All posts"
                />
                <PostList posts={latest} />
            </section>
        </main>
    );
}
