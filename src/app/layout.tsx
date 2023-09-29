import Typewriter from "@/components/typewriter";
import "./globals.css";
import type { Metadata } from "next";
import { Rubik, Roboto } from "next/font/google";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Button from "@/components/button";

const rubik = Rubik({
    subsets: ["latin"],
});
const roboto = Roboto({ subsets: ["latin"], weight: ["300"] });

export const metadata: Metadata = {
    title: "Alex Klos / Prohobo.dev",
    description: "My portfolio site",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${roboto.className}`}>
                <main className="container">
                    <nav className="w-full h-[54px] flex items-center">
                        <div
                            className={`w-full flex items-center justify-between ${rubik.className}`}
                        >
                            <div className="font-medium">
                                <Typewriter text="PROHOBO.DEV" delay={75} />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <Button
                                        url="https://www.linkedin.com/in/alexander-klos-460787120"
                                        icon={
                                            <AiFillLinkedin className="text-2xl mr-1" />
                                        }
                                        label="LinkedIn"
                                    />
                                    <Button
                                        url="https://github.com/aklos"
                                        icon={
                                            <AiFillGithub className="text-2xl mr-1" />
                                        }
                                        label="Github"
                                    />
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="min-h-screen">{children}</div>
                    <footer className="text-center text-sm opacity-40 py-16">
                        <div>Copyright © Alexander Klos</div>
                        <div>Suite 59, 30 Durham Road, London, SW20 0TW</div>
                    </footer>
                </main>
            </body>
        </html>
    );
}
