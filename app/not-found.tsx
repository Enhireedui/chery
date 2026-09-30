/* `[locale]`-ээс гадуурх танигдаагүй хаяг (жишээ нь байхгүй `.png`).
   Сайтын хуудсуудын 404 нь `app/[locale]/not-found.tsx` (цэс, хөлтэй).
   Энд сайтын CSS ачаалагдахгүй тул хамгийн энгийн хоёр хэлтэй хуудас. */
export default function GlobalNotFound() {
  return (
    <html lang="mn">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0e0e10", color: "#fff" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
          <div>
            <p style={{ opacity: 0.6, letterSpacing: ".12em" }}>404</p>
            <h1 style={{ fontWeight: 500, margin: "8px 0 24px" }}>Хуудас олдсонгүй · Page not found</h1>
            <a href="/" style={{ color: "#fff" }}>CHERY Mongolia</a>
          </div>
        </main>
      </body>
    </html>
  );
}
