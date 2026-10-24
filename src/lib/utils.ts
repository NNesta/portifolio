/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const isExternal = (href: string) => /^https?:\/\//i.test(href);

export const formatNumber = (n: number) => n.toLocaleString("en-US");

/** "JavaScript, Python and SQL" */
export const andList = (items: string[]) =>
  new Intl.ListFormat("en-GB", { type: "conjunction" }).format(items.filter(Boolean));

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}
