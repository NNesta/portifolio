// The shape of src/content.ts. If an edit there breaks this shape, the
// editor underlines it and `npm run build` stops before anything ships.

export interface Link {
  label: string;
  url: string;
}

export interface Person {
  name: string;
  role: string;
  location: string;
  /** IANA time zone, used for the live local time on the page. */
  timeZone: string;
  /** Photo address. Leave "" to show initials instead. */
  photo: string;
  photoAlt: string;
  email: string;
  /** Leave "" to hide. */
  phone: string;
}

export type SectionId = "work" | "experience" | "principles" | "skills" | "about" | "practice" | "contact";

export interface FlowStep {
  step: string;
  note: string;
}

export interface Featured {
  name: string;
  role: string;
  org: string;
  status: string;
  url: string;
  linkLabel: string;
  summary: string;
  points: string[];
  flowTitle: string;
  flow: FlowStep[];
  stack: string[];
}

export interface Project {
  name: string;
  type: string;
  description: string;
  stack: string[];
  links: Link[];
}

export interface Job {
  role: string;
  org: string;
  place: string;
  period: string;
  current?: boolean;
  points: string[];
}

export type KyuColor = "white" | "yellow" | "blue" | "purple";

export interface CodewarsStats {
  rank: string;
  rankColor: KyuColor;
  completed: number;
  honor: number;
  leaderboard: number;
  languages: string[];
}

export interface CodewarsProfile extends CodewarsStats {
  username: string;
  memberSince: string;
}

export interface Repo {
  name: string;
  description: string;
  language: string;
  url: string;
  stars?: number;
  /** ISO date of the last push. Only live repositories have one. */
  pushed?: string;
}

export interface GithubProfile {
  username: string;
  publicRepos: number;
  /** true: show the 4 most recently updated repositories. false: always show the highlights. */
  showLatest: boolean;
  /** Repository names never to list. */
  hideRepos: string[];
  /** Shown when the latest repositories can't load. */
  highlights: Repo[];
}

export interface SiteContent {
  person: Person;
  links: {
    cv: string;
    github: string;
    linkedin: string;
    codewars: string;
    /** This site's repository. Leave "" to hide the "View source" link. */
    source: string;
  };
  hero: { availability: string; intro: string };
  facts: { label: string; value: string }[];
  sections: Record<SectionId, { title: string; intro: string }>;
  featured: Featured | null;
  projects: Project[];
  experience: Job[];
  principles: { title: string; text: string }[];
  skills: { group: string; note: string; items: string[] }[];
  about: string[];
  learning: { title: string; org: string; period: string }[];
  languages: { name: string; level: string }[];
  practice: {
    codewars: CodewarsProfile | null;
    github: GithubProfile | null;
  };
  footer: { note: string; updated: string };
  settings: {
    /** Load the latest Codewars numbers and GitHub repositories in the visitor's browser. */
    liveData: boolean;
  };
}
