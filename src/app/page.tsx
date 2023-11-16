import Email from "@/components/email";
import Project from "@/components/project";
import Splash from "@/components/splash";
import { PiCaretRightBold } from "react-icons/pi";

export default function Home() {
    return (
        <div>
            <section className="mb-16">
                <Splash />
                <div className="bg-blue-50 dark:bg-violet-700 p-4 text-center md:text-left">
                    <PiCaretRightBold className="mr-1 mb-1 hidden md:inline-block" />
                    <span>
                        Currently busy! But if you want to get in touch, send me
                        an email: <Email />
                    </span>
                </div>
            </section>
            <div className="grid md:grid-cols-2 gap-16 mb-16 px-4 md:px-0">
                <section className="prose dark:prose-invert max-w-screen-md">
                    <p>
                        Hi! I'm an experienced <b>full-stack web</b> and{" "}
                        <b>independent game developer</b> who thrives on
                        creating compelling digital experiences. As a
                        freelancer, I spend most of my time developing web
                        applications. I also work on games and desktop/mobile
                        applications when the opportunity arises.
                    </p>
                    <p>
                        My tech stack includes <b>Typescript</b>, <b>Python</b>,
                        and <b>Rust</b>. I'm currently studying{" "}
                        <b>deep neural networks</b>. Regardless of the platform
                        (AWS, Fly.io, Heroku, etc.), I handle my own deployments
                        so that the products I develop are always performing at
                        their best.
                    </p>
                    <p>
                        My goal is not to master a long list of frameworks and
                        technologies, but to utilize them effectively to build
                        tools, services, and games that offer great experiences.
                    </p>
                </section>
                <div className="prose dark:prose-invert">
                    <h3>My services:</h3>
                    <ul>
                        <li>
                            Web development (marketing, CMS, APIs, dashboards)
                        </li>
                        <li>
                            Scripting (data processing, neural networks,
                            automation)
                        </li>
                        <li>
                            Desktop applications (tooling, clients, automation)
                        </li>
                        <li>Technical consultations</li>
                    </ul>
                    <p></p>
                </div>
            </div>
            <div className="border-b dark:opacity-10 my-16"></div>
            <section className="mb-16 prose dark:prose-invert max-w-none px-4 md:px-0">
                <h3>Projects & Clients</h3>
                <div className="mt-8 grid md:grid-cols-4 gap-16">
                    <Project
                        title="Detoxer"
                        position="Software development"
                        link="https://addons.mozilla.org/en-US/firefox/addon/detoxer"
                        timePeriod="2023"
                    ></Project>
                    <Project
                        title="Project Sailor"
                        position="Software development"
                        timePeriod="WIP"
                    ></Project>
                    <Project
                        title="CNTRC AI"
                        position="Software development"
                        link="https://www.cntrc.ai/"
                        timePeriod="2023"
                    ></Project>
                    <Project
                        title="Next Chapter"
                        position="Web design & development"
                        link="https://www.nextchapter.agency/en"
                        timePeriod="2023"
                    ></Project>
                    <Project
                        title="Hoorcentrum Aerts"
                        position="Web design & development"
                        link="https://hoorcentrumaerts.be/"
                        timePeriod="2023"
                    ></Project>
                    <Project
                        title="Slogidex"
                        position="Software development"
                        link="https://github.com/aklos/slogidex"
                        timePeriod="2023"
                    ></Project>
                    <Project
                        title="This Machine Greens"
                        position="Web design, development, and VFX"
                        link="https://thismachinegreens.com/"
                        timePeriod="2021"
                    ></Project>
                    <Project
                        title="RiskXchange"
                        position="Software development"
                        link="https://riskxchange.co/"
                        timePeriod="2020"
                    ></Project>
                </div>
            </section>
            <div className="border-b dark:opacity-10 my-16"></div>
            <section className="mb-16 prose dark:prose-invert max-w-none px-4 md:px-0">
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
                        link="https://motorway.co.uk/"
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
