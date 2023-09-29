import Email from "@/components/email";
import Project from "@/components/project";
import Splash from "@/components/splash";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function Home() {
    return (
        <div>
            <section className="mb-16">
                <Splash />
            </section>
            <section className="mb-16 prose max-w-screen-md mx-auto">
                <p className={roboto.className}>
                    Hi! I'm an experienced <b>full-stack web</b> and{" "}
                    <b>independent game developer</b> who thrives on creating
                    compelling digital experiences. As a freelancer, I spend
                    most of my time developing web applications. I also work on
                    games and desktop/mobile applications when the opportunity
                    arises.
                </p>
                <p className={roboto.className}>
                    My tech stack includes <b>Typescript</b>, <b>Python</b>, and{" "}
                    <b>Rust</b>. I'm currently studying{" "}
                    <b>deep neural networks</b>. Regardless of the platform
                    (AWS, Fly.io, Heroku, etc.), I handle my own deployments so
                    that the products I develop are always performing at their
                    best.
                </p>
                <p className={roboto.className}>
                    My primary goal is not just to master a long list of
                    frameworks and technologies, but to utilize them effectively
                    to build tools, services, and games that offer outstanding
                    experiences.
                </p>
                <div className="bg-yellow-50 p-4 mt-12">
                    Currently busy with contract work. But if you want to get in
                    touch, send me an email: <Email />
                </div>
            </section>
            <div className="border-b my-16"></div>
            <section className="mb-16 prose max-w-none">
                <h3>Projects</h3>
                <div className="mt-8 grid md:grid-cols-4 gap-16">
                    <Project
                        title="This Machine Greens"
                        position="Web design, development, and VFX"
                    ></Project>
                    <Project
                        title="ECG Classification"
                        position="Software development"
                    ></Project>
                    <Project
                        title="Project Sailor"
                        position="Software development"
                    ></Project>
                    <Project
                        title="Next Chapter"
                        position="Web design & development"
                    ></Project>
                    <Project
                        title="Hoorcentrum Aerts"
                        position="Web design & development"
                    ></Project>
                    <Project
                        title="RiskXchange"
                        position="Software development"
                    ></Project>
                    <Project
                        title="Slogidex"
                        position="Software development"
                    ></Project>
                    <Project
                        title="Taskineer"
                        position="Software development"
                    ></Project>
                    <Project
                        title="Deldico Tracking API"
                        position="Software development"
                    ></Project>
                </div>
            </section>
            <div className="border-b my-16"></div>
            <section className="mb-16 prose max-w-none">
                <h3>Experience</h3>
                <div className="grid md:grid-cols-3 gap-16">
                    <Project
                        title="Bulb Energy"
                        image="/bulb.jpg"
                        timePeriod="Q1 2019 - Q2 2020"
                        position="Software engineer"
                    ></Project>
                    <Project
                        title="Motorway"
                        image="/motorway.png"
                        timePeriod="Q2 2017 - Q1 2019"
                        position="Software engineer"
                    ></Project>
                    <Project
                        title="SSK"
                        image="/surfland.jpg"
                        timePeriod="Q1 2013 - Q1 2017"
                        position="Junior software engineer"
                    ></Project>
                </div>
            </section>
        </div>
    );
}
