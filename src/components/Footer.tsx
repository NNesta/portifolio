import { site } from "../content";

const YEAR = new Date().getFullYear();

export function Footer() {
  const { person, footer, links } = site;
  return (
    <footer className="pt-8 pb-[calc(32px+env(safe-area-inset-bottom,0px))] text-sm text-muted">
      <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2">
        {/* The year comes from the prerendered page; it updates with the next build. */}
        <p suppressHydrationWarning>{`© ${YEAR} ${person.name}. ${footer.note}`}</p>
        <p>
          {footer.updated && `Last updated ${footer.updated}`}
          {footer.updated && links.source && " · "}
          {links.source && (
            <a href={links.source} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-accent">
              View source
            </a>
          )}
        </p>
      </div>
    </footer>
  );
}
