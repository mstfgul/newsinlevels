/**
 * Renders a schema.org JSON-LD block. `<` is escaped so page content can
 * never break out of the script tag (XSS via JSON.stringify).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
