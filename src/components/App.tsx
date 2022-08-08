import * as React from "react";
import Thumbnail from "react-webpage-thumbnail";
import Logo from "../assets/logo.svg";
import { Mailbox2, Linkedin, Github } from "react-bootstrap-icons";
import Splash from "./Splash";

export default function App() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="prose font-body max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Logo width={40} height={40} className="mr-4" />
            <h1 className="uppercase mb-0">Alexander Klos</h1>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <NavButton
              onClick={() => {
                window.location.href = "mailto:contact@alexklos.ca";
              }}
            >
              <Mailbox2 size={34} />
            </NavButton>
            <NavButton
              onClick={() => {
                window.open(
                  "https://www.linkedin.com/in/alexander-klos-460787120/",
                  "_blank"
                );
              }}
            >
              <Linkedin size={25} className="mx-auto" />
            </NavButton>
            <NavButton
              onClick={() => {
                window.open("https://github.com/aklos", "_blank");
              }}
            >
              <Github size={25} className="mx-auto" />
            </NavButton>
          </div>
        </div>
        <div className="text-xl">
          <section className="mb-16">
            <p>
              I'm a full-stack web and indie game developer. My focus is on
              building great experiences, whether it's a tool, service, or a
              game.
            </p>
            <p>
              Modern software should be simple, powerful, and fast. I support
              the{" "}
              <a
                href="https://www.humanetech.com/"
                className="text-blue-600 hover:text-blue-500 transition duration-100"
              >
                Center for Humane Technology
              </a>{" "}
              initiative, and strive to help create a future where tech works
              for us - not the other way around.
            </p>
            <p>Currently residing in London, UK.</p>
          </section>
          <section className="mb-16">
            <h3 className="mb-8 uppercase">My programming languages:</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4">
              <TechPill>
                <span>JavaScript / TypeScript</span>
              </TechPill>
              <TechPill>
                <span>SQL</span>
              </TechPill>
              <TechPill>
                <span>Python</span>
              </TechPill>
              <TechPill>
                <span>Rust</span>
              </TechPill>
            </div>
          </section>
          <section>
            <h3 className="mb-8 uppercase">Some of the work I've done:</h3>
            <ul className="list-none m-0 p-0">
              <Experience
                date="Q1 2022"
                company="Nostro Trading"
                link="https://nostrotrading.co.uk"
                description={
                  <p>
                    Developed the product and website for prop trading firm.
                    Architected backend API and database schema. Integrated with
                    MetaAPI service.
                  </p>
                }
              />
              <Experience
                date="Q1 2022"
                company="Deldico BE"
                link="https://deldico.be"
                description={
                  <p>
                    Helped develop new marketing platform. Created Docker
                    deployments for backend servers and frontend client to
                    interact with API.
                  </p>
                }
              />
              <Experience
                date="Q4 2021"
                company="This Machine Greens"
                link="https://thismachinegreens.com"
                description={
                  <p>
                    Website creation and AI video post-processing. Designed and
                    created website for documentary premiere, and processed
                    video clips with flow-edge video completion algorithm to
                    clean up shots.
                  </p>
                }
              />
              <Experience
                date="Q4 2020 - Q1 2021"
                company="RiskXchange"
                link="https://riskxchange.co"
                description={
                  <p>
                    Designed and generated dynamic visual reports. Fetched data
                    through API to create various D3.js visualizations and
                    effectively present data to users.
                  </p>
                }
              />
              <Experience
                date="Q1 2019 - Q2 2020"
                company="Bulb Energy"
                link="https://bulb.co.uk"
                description={
                  <p>
                    Full-stack engineer working on multiple projects at the
                    company. Primarily part of the smart meter team, I was
                    tasked with creating an automated appointment booking and
                    reminder system for 10,000s of Bulb members.
                  </p>
                }
              />
              <Experience
                date="Q2 2017 - Q4 2018"
                company="Motorway"
                link="https://motorway.co.uk"
                description={
                  <p>
                    Full-stack engineer working as part of the original team.
                    Architected all business processes and database schema,
                    worked with co-founders to build website, and helped onboard
                    new members to the team.
                  </p>
                }
              />
            </ul>
          </section>
        </div>
        <footer className="p-8 flex items-center justify-center">
          <span>© Alexander Klos</span>
        </footer>
      </div>
      {/* <Splash /> */}
    </div>
  );
}

function NavButton(props: { children: any; onClick: () => void }) {
  const { children, onClick } = props;
  return (
    <button
      className="relative rounded-full text-blue-600 hover:text-blue-500 transition duration-100 w-12 h-12"
      onClick={onClick}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </button>
  );
}

function TechPill(props: { children: any }) {
  const { children } = props;

  return (
    <div className="odd:bg-gray-200 even:bg-gray-100 px-2 py-1 text-center">
      {children}
    </div>
  );
}

function Experience(props: {
  date: string;
  company: string;
  link: string;
  description: React.ReactElement<any, any>;
}) {
  const { date, company, link, description } = props;

  // React.useEffect(() => {}, []);

  return (
    <li className="list-inside p-0 m-0 flex mb-8">
      <div className="flex-shrink-0 w-[256px] h-[170px]">
        <a href={link}>
          <Thumbnail url={link} width={256} height={170} />
        </a>
      </div>
      <div className="px-4 py-1">
        <h4 className="mt-0">
          <a
            href={link}
            className="text-blue-600 hover:text-blue-500 transition duration-100"
          >
            {company} ({date})
          </a>
        </h4>
        {description}
      </div>
    </li>
  );
}