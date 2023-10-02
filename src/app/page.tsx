import Email from "@/components/email";
import Project from "@/components/project";
import Splash from "@/components/splash";

export default function Home() {
    return (
        <div>
            <section className="mb-16">
                <Splash />
                <div className="bg-orange-100 p-4">
                    Currently busy! But if you want to get in touch, send me an
                    email: <Email />
                </div>
            </section>
            <div className="grid md:grid-cols-2 gap-16 mb-16">
                <section className="prose max-w-screen-md">
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
                <div className="prose">
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
                        title="CNTRC AI"
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
