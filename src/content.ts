/* =====================================================================
   SITE CONTENT
   ---------------------------------------------------------------------
   Everything people read on the site comes from this file.
   Run `npm run dev`, change the text between the quotes and save:
   the page in your browser updates straight away.

   Good to know
   - Keep the quotes "" and the comma at the end of each line. If you
     break the shape of the file, VS Code underlines the mistake and
     `npm run build` stops with a message, so a typo never goes live.
   - To hide a field (for example your phone number), set it to "".
   - To remove a whole item (a project, a job), delete everything from
     its { to its }, including the comma after it.
   - To add an item, copy an existing one and change the text.

   Photo
   - By default the site shows your GitHub profile picture.
   - To use another picture: copy it into public/assets (for example
     public/assets/profile.jpg) and set photo below to
     "assets/profile.jpg".

   CV
   - Replace public/assets/Nestor_Ngabonziza_CV.pdf with your new CV
     (keep the same file name), or change links.cv below.
   ===================================================================== */

import type { SiteContent } from "./types";

export const site: SiteContent = {
  person: {
    name: "Nestor Ngabonziza",
    role: "Full-stack web developer and team lead",
    location: "Kigali, Rwanda",
    timeZone: "Africa/Kigali", // used for the live local time on the page
    photo: "https://avatars.githubusercontent.com/nnesta?size=640",
    photoAlt: "Portrait of Nestor Ngabonziza",
    email: "ngabonest@gmail.com",
    phone: "+250 787 893 097",
  },

  links: {
    cv: "assets/Nestor_Ngabonziza_CV.pdf",
    github: "https://github.com/nnesta",
    linkedin: "https://www.linkedin.com/in/nestor-ngabonziza-5a6767155/",
    codewars: "https://www.codewars.com/users/Ngabonziza",
    // After you push this site to GitHub, paste the repository address
    // here to show a "View source" link in the footer.
    source: "",
  },

  hero: {
    availability: "Open to mid and senior web developer roles",
    intro:
      "I build fast, reliable web and mobile apps with React, Next.js, TypeScript and Node.js. Right now I lead the team building Kumva’s Farm Smarter platform, which turns sensor and farm data into clear advice for farmers.",
  },

  // Four short facts under the introduction.
  facts: [
    { label: "Experience", value: "3+ years shipping web and mobile apps" },
    { label: "Now", value: "Team Lead at Kumva Insights" },
    { label: "Codewars", value: "4 kyu, 231 kata solved" },
    { label: "Studying", value: "MSc in Big Data Analytics" },
  ],

  // Section titles and the short line under each title.
  sections: {
    work: {
      title: "Selected work",
      intro: "Products I have built or led, from company websites to a data platform for farmers.",
    },
    experience: {
      title: "Experience",
      intro: "From front-end intern in 2022 to team lead today.",
    },
    principles: {
      title: "How I work",
      intro: "What a team can expect from me.",
    },
    skills: {
      title: "Skills",
      intro: "The tools I use most, grouped by where they sit in a product.",
    },
    about: {
      title: "About me",
      intro: "",
    },
    practice: {
      title: "Practice and code",
      intro: "I keep my problem-solving sharp on Codewars and share code on GitHub.",
    },
    contact: {
      title: "Let’s talk",
      intro: "I’m open to mid and senior web developer roles. Email is the quickest way to reach me.",
    },
  },

  // The large project at the top of "Selected work".
  featured: {
    name: "Kumva Farm Smarter Platform",
    role: "Team Lead",
    org: "Kumva Insights",
    status: "Current",
    url: "https://kumva.io/",
    linkLabel: "kumva.io",
    summary:
      "A mobile app and web dashboard that help poultry farmers and Farm Extension Officers spot problems early and know what to do next.",
    points: [
      "Lead the team: I plan the work, review code and make the main technical decisions.",
      "Designed the backend as 11 FastAPI services that share events through RabbitMQ, each with its own PostgreSQL database.",
      "Planned an offline-first React Native app, so farm workers can record data with no signal and sync later.",
      "Designed AI-written weekly reports in Kinyarwanda, English and French, with every number checked against the real data.",
    ],
    // The steps below are animated: a reading travels from the first
    // step to the last, one step at a time.
    flowTitle: "How a reading travels from a chicken house to a phone",
    flow: [
      { step: "House sensors", note: "Temperature, humidity and air quality" },
      { step: "MQTT and Telegraf", note: "Readings arrive every 5 minutes" },
      { step: "InfluxDB", note: "Raw readings kept for 2 years" },
      { step: "FastAPI services", note: "Checks, alerts, KPIs and reports" },
      { step: "App and dashboard", note: "Push, SMS and weekly reports" },
    ],
    stack: ["React Native", "Python", "FastAPI", "PostgreSQL", "Redis", "RabbitMQ", "MQTT", "InfluxDB", "Claude API"],
  },

  // Other projects. Each one can have several links.
  projects: [
    {
      name: "Circulor",
      type: "Company website",
      description:
        "Website for Circulor, a company that traces raw materials through supply chains. Content is managed in Strapi.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Strapi"],
      links: [{ label: "circulor.com", url: "https://circulor.com" }],
    },
    {
      name: "SAIZ dashboard",
      type: "Web dashboard",
      description: "Dashboard for SAIZ, a size and fit recommender used by online fashion stores.",
      stack: ["Next.js", "Tailwind CSS", "Redux"],
      links: [{ label: "saiz.io", url: "https://www.saiz.io" }],
    },
    {
      name: "CSC SensorHub",
      type: "Android app",
      description:
        "App for Climate Solutions that registers sensors and sends their data to the cloud, to track the use of cleaner cooking.",
      stack: ["React Native", "MobX", "TypeScript"],
      links: [{ label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.cscsensorhub" }],
    },
    {
      name: "Co-Design",
      type: "Open-source web tool",
      description: "Web tool for EnAccess, a foundation that supports open-source technology for energy access.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [{ label: "Live site", url: "https://enaccess.github.io/co-design-FE" }],
    },
    {
      name: "Baumeister",
      type: "Company website",
      description: "Website for the agency Agentur Baumeister.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [{ label: "agentur-baumeister.com", url: "https://agentur-baumeister.com" }],
    },
    {
      name: "Barefoot Nomad",
      type: "Team project",
      description:
        "Travel and accommodation booking app built in a team during Andela’s Technical Leadership Program.",
      stack: ["JavaScript"],
      links: [
        { label: "Front end on GitHub", url: "https://github.com/atlp-rwanda/cod-fe" },
        { label: "Back end on GitHub", url: "https://github.com/atlp-rwanda/cod-be" },
      ],
    },
  ],

  experience: [
    {
      role: "Team Lead, Farm Smarter Platform",
      org: "Kumva Insights",
      place: "Kigali, Rwanda",
      period: "Current",
      current: true,
      points: [
        "Lead the team building a mobile app, web dashboard and backend that turn sensor and farm data into clear advice for poultry farmers.",
        "Own the technical design across web, mobile, data and AI, and review the team’s code.",
      ],
    },
    {
      role: "Software Developer",
      org: "KB21",
      place: "Kigali, Rwanda",
      period: "Jun 2023 – Present",
      current: true,
      points: [
        "Build web apps that load fast and are easy to use, with React, Next.js, TypeScript, Tailwind CSS and Material UI.",
        "Build REST APIs with Node.js and MongoDB, mobile apps with React Native, and Strapi setups that let clients edit their own content.",
        "Mentor junior developers, review their code and help with testing before each release.",
        "Work in Agile sprints: planning, estimating and shipping in small, regular steps.",
      ],
    },
    {
      role: "Software Developer Trainee",
      org: "The Gym",
      place: "Kigali, Rwanda",
      period: "Sep 2022 – Jun 2023",
      points: [
        "Finished an intensive full-stack training in JavaScript, React, Next.js and Tailwind CSS.",
        "Built responsive, accessible web apps alone and in teams, and improved code through debugging and refactoring.",
      ],
    },
    {
      role: "Frontend Developer Intern",
      org: "Justice Chatbot Ltd",
      place: "Kampala, Uganda",
      period: "Jul 2022 – Dec 2022",
      points: [
        "Helped build the interface of the OnDuka platform with React, Next.js and Tailwind CSS, so it works well on phones and in every major browser.",
        "Connected pages to APIs with the backend team and kept a set of reusable components.",
      ],
    },
  ],

  principles: [
    {
      title: "Build for real conditions",
      text: "Weak signal, older phones and several languages are normal for many users. I plan for them from the start: light pages, apps that work offline and text in the user’s own language.",
    },
    {
      title: "Keep code easy to change",
      text: "Small components, clear names and careful code reviews, so the next developer can pick up the work and move fast.",
    },
    {
      title: "Ship in small steps",
      text: "I plan and estimate in short sprints and release often, so problems show up early and feedback arrives while it is still cheap to act on.",
    },
    {
      title: "Help the team grow",
      text: "I mentor junior developers and lead a team. I like explaining how things work and giving people room to own their part.",
    },
  ],

  skills: [
    {
      group: "Front end",
      note: "Where I spend most of my time.",
      items: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "Material UI", "Redux", "MobX", "HTML and CSS", "Accessibility", "Web performance"],
    },
    {
      group: "Mobile",
      note: "Cross-platform apps that keep working offline.",
      items: ["React Native", "TypeScript", "MobX", "Offline-first sync"],
    },
    {
      group: "Back end and data",
      note: "The APIs and services behind the screens.",
      items: ["Node.js", "NestJS", "Python", "FastAPI", "Java (Spring Boot)", "REST APIs", "Microservices", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "InfluxDB", "Strapi"],
    },
    {
      group: "AI in products",
      note: "LLM features that people can trust.",
      items: ["Claude and OpenAI APIs", "RAG", "Prompt engineering", "Tool calling", "Structured outputs", "LangChain", "LangGraph", "MCP", "AI evaluation and testing"],
    },
    {
      group: "Tools and teamwork",
      note: "How I help a team ship.",
      items: ["Git", "Docker", "Kubernetes", "Flutterwave payments", "Agile and Scrum", "Code review", "Mentoring"],
    },
  ],

  // Paragraphs in the "About me" section.
  about: [
    "I’m a software developer from Kigali. I trained at Andela and The Gym, worked as a front-end intern in 2022, and since 2023 I have built web and mobile products for clients at KB21. Today I also lead the team building Kumva’s Farm Smarter platform.",
    "I like work that makes a clear difference for the people who use it: pages that load fast on a weak connection, apps that keep working offline, and screens in the user’s own language. I care about readable code and I enjoy mentoring.",
    "I keep learning. In 2026 I took an eight-month AI specialization with MaibornWolff and Ojemba, and I’m studying for a Master’s in Big Data Analytics.",
  ],

  learning: [
    { title: "MSc in Big Data Analytics", org: "Adventist University of Central Africa", period: "2025 – 2027, in progress" },
    { title: "AI Specialization: LLMs in Real-World Applications", org: "MaibornWolff and Ojemba", period: "Mar – Nov 2026" },
    { title: "Technical Leadership Program", org: "Andela Rwanda", period: "Nov 2021 – Oct 2022" },
    { title: "BSc in Electronics and Telecommunication Engineering", org: "University of Rwanda, College of Science and Technology", period: "2017 – 2022" },
  ],

  languages: [
    { name: "Kinyarwanda", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "French", level: "Basic" },
  ],

  // Numbers here are shown if the live numbers from Codewars or GitHub
  // can't load. Update them now and then.
  practice: {
    codewars: {
      username: "Ngabonziza",
      rank: "4 kyu",
      rankColor: "blue", // white, yellow, blue or purple, as on Codewars
      completed: 231,
      honor: 1180,
      leaderboard: 28003,
      languages: ["JavaScript", "Python"],
      memberSince: "September 2022",
    },
    github: {
      username: "nnesta",
      publicRepos: 53,
      // true: show your 4 most recently updated repositories.
      // false: always show the highlights below instead.
      showLatest: true,
      // Repository names you never want listed, for example ["old-test"].
      hideRepos: [],
      // Shown when your latest repositories can't load from GitHub.
      highlights: [
        { name: "atlp-rwanda/cod-fe", description: "Barefoot Nomad front end, a team project", language: "JavaScript", url: "https://github.com/atlp-rwanda/cod-fe" },
        { name: "atlp-rwanda/cod-be", description: "Barefoot Nomad back end, a team project", language: "JavaScript", url: "https://github.com/atlp-rwanda/cod-be" },
      ],
    },
  },

  footer: {
    note: "Built with React, Vite and Tailwind CSS. No trackers.",
    updated: "October 2026",
  },

  settings: {
    // true: load your latest Codewars numbers and GitHub repositories
    // when someone opens the site. false: always use the numbers above.
    liveData: true,
  },
};
