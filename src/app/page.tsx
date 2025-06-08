import { AiFillGithub, AiFillLinkedin, AiFillX } from "react-icons/ai";
import Splash from "@/components/splash";

const projects = [
    {
        name: "Scryer",
        type: "Shopify App",
        year: "2025",
        link: "https://scryerapp.io",
        desc: "AI analyst for Shopify stores",
    },
    {
        name: "Detoxer",
        type: "Browser Extension",
        year: "2023",
        link: "https://addons.mozilla.org/en-US/firefox/addon/detoxer",
        desc: "Firefox extension for social media detox",
    },
    // {
    //     name: "Project Sailor",
    //     type: "Game",
    //     year: "WIP",
    //     link: null,
    //     desc: "Indie game project in development",
    // },
    {
        name: "CNTRC AI",
        type: "Platform",
        year: "2023",
        link: "https://www.cntrc.ai/",
        desc: "Long-term visitor analytics platform",
    },
    {
        name: "Next Chapter",
        type: "Website",
        year: "2023",
        link: "https://www.nextchapter.agency/en",
        desc: "Agency website with modern design",
    },
    {
        name: "Hoorcentrum Aerts",
        type: "Website",
        year: "2023",
        link: "https://hoorcentrumaerts.be/",
        desc: "Healthcare website for audiology practice",
    },
    {
        name: "Slogidex",
        type: "Tool",
        year: "2023",
        link: "https://github.com/aklos/slogidex",
        desc: "Process management tool",
    },
    {
        name: "This Machine Greens",
        type: "Website",
        year: "2021",
        link: "https://thismachinegreens.com/",
        desc: "Interactive website with VFX",
    },
    // {
    //     name: "RiskXchange",
    //     type: "Platform",
    //     year: "2020",
    //     link: "https://riskxchange.co/",
    //     desc: "Cybersecurity risk management platform",
    // },
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
            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <Splash />

                {/* Hero Content */}
                <div className="relative z-20 text-center">
                    <h1 className="text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                        Alex Klos / Prohobo
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Software developer
                    </p>
                    <div className="flex gap-4 justify-center items-center">
                        <a
                            href="https://github.com/aklos"
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                        >
                            <AiFillGithub className="text-xl" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/alexander-klos-460787120"
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                        >
                            <AiFillLinkedin className="text-xl" />
                        </a>
                        <a
                            href="https://x.com/alexmklos"
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                        >
                            <AiFillX className="text-xl" />
                        </a>
                        <a
                            href="mailto:hello@prohobo.dev"
                            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-all duration-200 text-sm font-medium"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </section>

            {/* Content overlapping splash */}
            <section className="relative -mt-48 z-30 max-w-4xl mx-auto px-6">
                {/* About */}
                {/* <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        I'm an experienced full-stack web and independent game
                        developer. As a freelancer, I develop web applications,
                        games, and desktop/mobile apps. My tech stack includes
                        TypeScript, Python, and Rust.
                    </p>
                </div> */}

                {/* Projects */}
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                        Projects
                    </h2>
                    <div className="space-y-6">
                        {projects.map((project, i) => (
                            <div
                                key={i}
                                className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {project.name}
                                        </h3>
                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                            {project.type}
                                        </span>
                                    </div>
                                    {project.desc && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {project.desc}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 ml-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {project.year}
                                    </span>
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                                        >
                                            View →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl p-8 mb-16 border border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                        Roles
                    </h2>
                    <div className="space-y-4">
                        {experience.map((job, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {job.company}
                                        </h3>
                                        {job.type ? (
                                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                                {job.type}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {job.role}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {job.period}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
                <div>Copyright © Alexander Klos</div>
                <div>Suite 59, 30 Durham Road, London, SW20 0TW</div>
            </footer>
        </div>
    );
}
