import GithubContributions from "@/components/github-calendar";

const projects = [
    {
        name: "Scryer",
        type: "Desktop App",
        year: "2026",
        link: "https://scryer.sh",
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
        company: "Freelancing",
        role: "Software Engineer",
        period: "2020-2025",
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
            <GithubContributions />

            {/* Content */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                {/* Projects */}
                <div className="mb-24">
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold mb-1 text-[var(--color-patent-fg)] dark:text-[var(--color-patent-dark-fg)]">
                        Projects
                    </h2>
                    <p className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] mb-8">
                        Selected work
                    </p>

                    <div className="border-t border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)]">
                        {projects.map((project, i) => (
                            <a
                                key={i}
                                href={project.link}
                                className="group flex items-baseline justify-between py-4 border-b border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)] hover:pl-2 transition-all duration-200"
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] tabular-nums">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-[family-name:var(--font-serif)] font-medium group-hover:text-[var(--color-patent-accent)] dark:group-hover:text-[var(--color-patent-dark-accent)] transition-colors">
                                        {project.name}
                                    </span>
                                    <span className="hidden sm:inline text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)]">
                                        {project.desc}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-4 shrink-0 ml-4">
                                    <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] uppercase tracking-wider hidden sm:inline">
                                        {project.type}
                                    </span>
                                    <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] tabular-nums">
                                        {project.year}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div className="mb-24">
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold mb-1 text-[var(--color-patent-fg)] dark:text-[var(--color-patent-dark-fg)]">
                        Experience
                    </h2>
                    <p className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] mb-8">
                        Where I&apos;ve worked
                    </p>

                    <div className="border-t border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)]">
                        {experience.map((job, i) => (
                            <div
                                key={i}
                                className="flex items-baseline justify-between py-4 border-b border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)]"
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className="font-[family-name:var(--font-serif)] font-medium">
                                        {job.company}
                                    </span>
                                    {job.type && (
                                        <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)]">
                                            {job.type}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-4 shrink-0 ml-4">
                                    <span className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)]">
                                        {job.role}
                                    </span>
                                    <span className="text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] tabular-nums">
                                        {job.period}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
