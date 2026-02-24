import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";

const plexSerif = IBM_Plex_Serif({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-serif",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Alex Klos",
    description: "Software developer",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${plexSerif.variable} ${plexMono.variable} font-[family-name:var(--font-mono)] bg-[var(--color-patent-bg)] dark:bg-[var(--color-patent-dark-bg)] text-[var(--color-patent-fg)] dark:text-[var(--color-patent-dark-fg)]`}
            >
                <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <img
                                src="/face.png"
                                alt="Alex Klos"
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)]"
                            />
                            <div>
                                <Link href="/">
                                    <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold mb-2 text-[var(--color-patent-fg)] dark:text-[var(--color-patent-dark-fg)] tracking-tight">
                                        Alex Klos
                                    </h1>
                                </Link>
                                <p className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)]">
                                    Software Engineer
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-center">
                            <a
                                href="https://github.com/aklos"
                                className="text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                <AiFillGithub className="text-lg" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/alexander-klos-460787120"
                                className="text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                <AiFillLinkedin className="text-lg" />
                            </a>
                            <a
                                href="https://x.com/alexmklos"
                                className="text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                <RiTwitterXFill className="text-base" />
                            </a>
                            <span className="w-px h-4 bg-[var(--color-patent-line)] dark:bg-[var(--color-patent-dark-line)]" />
                            <Link
                                href="/blog"
                                className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                Blog
                            </Link>
                            <span className="w-px h-4 bg-[var(--color-patent-line)] dark:bg-[var(--color-patent-dark-line)]" />
                            <a
                                href="mailto:hello@prohobo.dev"
                                className="text-sm text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)] hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                hello@prohobo.dev
                            </a>
                        </div>
                    </div>
                </header>
                {children}
                <footer className="max-w-4xl mx-auto px-6 pb-16">
                    <div className="border-t border-[var(--color-patent-line)] dark:border-[var(--color-patent-dark-line)] pt-8 flex items-center justify-between text-xs text-[var(--color-patent-muted)] dark:text-[var(--color-patent-dark-muted)]">
                        <div className="flex gap-5 items-center">
                            <a
                                href="https://github.com/aklos"
                                className="hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                <AiFillGithub className="text-lg" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/alexander-klos-460787120"
                                className="hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                <AiFillLinkedin className="text-lg" />
                            </a>
                            <a
                                href="https://x.com/alexmklos"
                                className="hover:text-[var(--color-patent-fg)] dark:hover:text-[var(--color-patent-dark-fg)] transition-colors"
                            >
                                <RiTwitterXFill className="text-base" />
                            </a>
                        </div>
                        <div>
                            &copy; {new Date().getFullYear()}
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-[var(--color-patent-muted)]/50 dark:text-[var(--color-patent-dark-muted)]/50">
                        Alexander Klos / Suite 59, 30 Durham Road, London, SW20 0TW
                    </p>
                </footer>
            </body>
        </html>
    );
}
