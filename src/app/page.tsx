import GithubContributions from "@/components/github-calendar";
import Pattern from "@/components/pattern";
import SectionHeading from "@/components/section-heading";

const projects = [
    {
        name: "Scryer",
        type: "Desktop App",
        year: "2026",
        link: "https://github.com/aklos/scryer",
        desc: "Visual architecture planner for AI coding assistants",
    },
    {
        name: "FLIP Water Sim",
        type: "Godot Extension",
        year: "2024",
        link: "https://github.com/aklos/godot-flip-water-simulation",
        desc: "FLIP fluid simulation for Godot 4 in C++",
    },
    {
        name: "Detoxer",
        type: "Browser Extension",
        year: "2023",
        link: "https://addons.mozilla.org/en-US/firefox/addon/detoxer",
        desc: "Firefox extension for social media detox",
    },
    {
        name: "CNTRC AI",
        type: "Platform",
        year: "2023",
        link: "https://www.cntrc.ai/",
        desc: "Long-term visitor analytics platform",
    },
    {
        name: "Next Chapter",
        type: "Fullstack",
        year: "2023",
        link: "https://www.nextchapter.agency/en",
        desc: "Agency website with modern design",
    },
    {
        name: "Hoorcentrum Aerts",
        type: "Fullstack",
        year: "2023",
        link: "https://hoorcentrumaerts.be/",
        desc: "Healthcare website for audiology practice",
    },
    {
        name: "Slogidex",
        type: "Desktop App",
        year: "2023",
        link: "https://github.com/aklos/slogidex",
        desc: "Process management tool",
    },
    {
        name: "This Machine Greens",
        type: "Fullstack",
        year: "2021",
        link: "https://thismachinegreens.com/",
        desc: "Interactive website with VFX",
    },
];

const experience = [
    {
        company: "Kupigo",
        role: "Tech Partner",
        period: "2026-Present",
    },
    {
        company: "Freelancing",
        role: "Software Engineer",
        period: "2020-Present",
    },
    {
        company: "Bulb Energy",
        type: "London, UK",
        role: "Software Engineer",
        period: "2019-2020",
    },
    {
        company: "Motorway",
        type: "London, UK",
        role: "Software Engineer",
        period: "2017-2019",
    },
    {
        company: "SSK",
        type: "Wroclaw, Poland",
        role: "Junior Software Engineer",
        period: "2013-2017",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-clip">
                <div className="relative max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-16 md:pb-24">
                <div className="peer/hero relative flex flex-col-reverse md:flex-row md:items-center gap-8 md:gap-12">
                    <div className="flex-1">
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
                            I build AI systems, developer tools, and the
                            occasional game.
                        </h1>
                        <p className="text-muted text-lg leading-relaxed max-w-xl">
                            AI engineering is the day job; the web, desktop,
                            and games fill the rest. Currently building{" "}
                            <a
                                href="https://github.com/aklos/scryer"
                                className="text-blue hover:underline underline-offset-4"
                            >
                                Scryer
                            </a>
                            , a visual architecture planner for AI coding
                            assistants.
                        </p>
                    </div>
                    <div className="relative shrink-0 self-start md:self-auto group">
                        <Pattern
                            variant="dots"
                            className="absolute -inset-1 translate-x-4 translate-y-4 rounded-full text-orange/80 motion-safe:transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5"
                        />
                        <img
                            src="/face.png"
                            alt="Alex Klos"
                            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full object-cover"
                        />
                    </div>
                </div>

                {/* Halftone diamond in the gap between text and photo;
                    rotates when the intro block above is hovered */}
                <Pattern
                    variant="dots"
                    className="pointer-events-none absolute -z-10 top-4 right-16 md:right-32 rotate-45 w-72 h-72 md:w-96 md:h-96 text-blue/10 motion-safe:transition-transform duration-1000 ease-out peer-hover/hero:rotate-[57deg]"
                />

                {/* GitHub activity, layered into the hero */}
                <div className="relative mt-14 group">
                    <Pattern
                        variant="stripes"
                        className="absolute inset-0 translate-x-2 translate-y-2 rounded-lg text-blue/25 motion-safe:transition-transform duration-300 group-hover:translate-x-3.5 group-hover:translate-y-3.5"
                    />
                    <Pattern
                        variant="dots"
                        className="absolute -top-3 -right-3 w-28 h-16 text-orange/70 motion-safe:transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                    <div className="relative bg-paper border border-line rounded-lg p-5 md:p-6 min-h-28">
                        <GithubContributions />
                    </div>
                </div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                {/* Projects */}
                <div className="mb-24">
                    <SectionHeading title="Projects" sub="Selected work" />

                    <div className="grid sm:grid-cols-2 gap-5">
                        {projects.map((project, i) => (
                            <a
                                key={project.name}
                                href={project.link}
                                className="relative group"
                            >
                                <Pattern
                                    variant="stripes"
                                    className={`absolute inset-0 rounded-lg opacity-0 motion-safe:transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:translate-y-1.5 ${
                                        i % 2 ? "text-blue/40" : "text-orange/50"
                                    }`}
                                />
                                <div className="relative h-full bg-paper border border-line rounded-lg p-5 motion-safe:transition-transform duration-200 group-hover:-translate-y-0.5">
                                    <div className="flex items-baseline justify-between gap-3 mb-2 font-mono text-xs text-muted">
                                        <span className="uppercase tracking-wider">
                                            {project.type}
                                        </span>
                                        <span className="tabular-nums">
                                            {project.year}
                                        </span>
                                    </div>
                                    <h3 className="font-display text-lg font-bold mb-1 group-hover:text-blue transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-muted leading-relaxed">
                                        {project.desc}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div className="mb-24">
                    <SectionHeading title="Experience" sub="Where I've worked" />

                    <div className="ml-1.5">
                        {experience.map((job, i) => (
                            <div
                                key={job.company}
                                className="relative pl-8 pb-8 last:pb-0"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                                        job.period.endsWith("Present")
                                            ? "bg-orange"
                                            : "bg-blue"
                                    }`}
                                />
                                {i < experience.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute -left-px top-5 bottom-0.5 border-l-2 border-dotted border-line"
                                    />
                                )}
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-display font-semibold">
                                            {job.company}
                                        </span>
                                        {job.type && (
                                            <span className="text-xs text-muted">
                                                {job.type}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-sm text-muted">
                                            {job.role}
                                        </span>
                                        <span className="font-mono text-xs text-muted tabular-nums">
                                            {job.period}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
