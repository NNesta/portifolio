# Nestor Ngabonziza — portfolio

The source of [nestorngabonziza.com](https://www.nestorngabonziza.com): a one-page portfolio built with
**React 19, Vite and Tailwind CSS 4**, written in TypeScript.

It is prerendered at build time, so the HTML that reaches the browser already holds the whole page.
Visitors on a weak connection read the content before any JavaScript has loaded; React then takes
over to add the live numbers and the motion.

## The details

A few animations, each with a job to do. They are plain CSS, `IntersectionObserver` and one canvas,
with no animation library. All of them switch off when the visitor asks for reduced motion.

| Where | What it does |
| --- | --- |
| Hero | The name rises in word by word. A contour map of the hills around Kigali draws in behind the photo, and with a mouse, a soft lamp follows the pointer and brings out the lines beneath it. |
| Featured project | The pipeline diagram plays itself: a reading travels from the chicken-house sensors to the phone, lighting each step as it arrives. |
| Scrolling | Sections fade up once as they enter the screen. Content that is already visible never blinks. |
| Practice | The Codewars and GitHub numbers count up, then ease to the live values when those arrive. |
| Menu | One underline slides to the section you are reading. |
| Small things | The availability dot pulses, the clock's colon blinks and the time changes exactly on the minute, link arrows nudge on hover, and the theme switch cross-fades the page. |

## Change the text

Everything people read lives in [`src/content.ts`](src/content.ts).

1. `npm install` (once), then `npm run dev` and open the address it prints.
2. Edit the text between the quotes in `src/content.ts` and save. The page updates as you type.
3. Commit and push. The host rebuilds the site.

The file is typed, so a missing comma or a misspelled field is underlined in VS Code, and
`npm run build` stops with a message instead of publishing a broken page.

- **Photo:** by default it is your GitHub profile picture. To use another one, put it in
  `public/assets/` and set `photo: "assets/profile.jpg"`. If a photo fails to load, the page shows
  your initials.
- **CV:** replace `public/assets/Nestor_Ngabonziza_CV.pdf`, keeping the name.
- **Live numbers:** the page loads your Codewars stats and your four most recently updated GitHub
  repositories in the visitor's browser, cached for an hour. If they can't load, it shows the
  numbers in `content.ts`, so update those now and then. `settings.liveData: false` turns this off;
  `github.hideRepos` keeps a repository off the list.
- **Source link:** once this repository is on GitHub, set `links.source` to its address to show a
  "View source" link in the footer.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local site with instant updates |
| `npm run build` | Type-check, build, then prerender into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Lint with oxlint |

Node 20.19+ or 22.12+ is required (Vite 8).

## Deploy

**Vercel** (current host). Import the GitHub repository; Vercel detects Vite. Check that the build
command is `npm run build` (not `vite build`, which would skip the prerender step) and the output
directory is `dist`. Add `nestorngabonziza.com` under the project's domains. Every push to `main`
then deploys by itself.

**GitHub Pages.** Build with `npm run build` and publish `dist/` (for example with the
`actions/deploy-pages` workflow). Asset paths are relative, so the site also works from a
`username.github.io/portfolio/` sub-folder.

**Netlify.** Build command `npm run build`, publish directory `dist`.

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) lints and builds every push
and pull request, so a broken change shows up as a red cross before it ships.

## How it's put together

```
src/
├── content.ts        all the text (edit this)
├── types.ts          the shape of content.ts
├── index.css         design tokens, type roles, keyframes
├── components/       one file per section, plus small shared pieces (ui.tsx)
├── hooks/            theme, local time, active section, live data
├── lib/
│   ├── contours.ts   the hero canvas: noise, marching squares, the lamp
│   ├── motion.ts     one shared IntersectionObserver, easing, reduced motion
│   └── live.ts       Codewars and GitHub requests with caching
├── main.tsx          browser entry: hydrates the prerendered page
└── entry-server.tsx  build-time entry used by scripts/prerender.js
public/assets/        CV, favicon and link-preview image, served at stable URLs
```

- **Theme.** Light or dark follows the system until the visitor picks one; the choice is applied
  by a tiny script in `index.html` before the first paint, so there is no flash. Dark colors are
  defined once, in `src/index.css`.
- **Link previews.** LinkedIn, WhatsApp and Slack use `public/assets/og-image.png`. If the site
  moves to another address, change the two URLs marked in `index.html`.
- **Fonts.** Bricolage Grotesque and Instrument Sans are self-hosted under the SIL Open Font License
  (`src/assets/fonts/LICENSE.txt`), so the site makes no requests to Google Fonts. No trackers
  either.
