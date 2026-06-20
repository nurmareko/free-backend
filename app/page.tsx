const liveUrl = "https://free-backend-neon.vercel.app/";
const baseUrl = "https://free-backend-neon.vercel.app/api";

const endpoints = [
  {
    method: "GET",
    path: "/api/items",
    body: "-",
    description: "All items, newest first.",
  },
  {
    method: "GET",
    path: "/api/items?mine=true",
    body: "-",
    description: "Only the authenticated caller's items.",
  },
  {
    method: "GET",
    path: "/api/items/{id}",
    body: "-",
    description: "Item detail.",
  },
  {
    method: "POST",
    path: "/api/items",
    body: "multipart",
    description: "Create an item. The owner is taken from the verified token.",
  },
  {
    method: "PUT",
    path: "/api/items/{id}",
    body: "multipart",
    description: "Update an item, owner only. Omitted fields keep their current values.",
  },
  {
    method: "DELETE",
    path: "/api/items/{id}",
    body: "-",
    description: "Delete an item, owner only. Also removes the stored image.",
  },
  {
    method: "GET",
    path: "/api/me",
    body: "-",
    description: "Authenticated profile from the verified Google ID token.",
  },
];

const multipartFields = [
  ["title", "string", "Required on create. Optional on update."],
  ["description", "string", "Required on create. Optional on update."],
  ["location", "string", "Required on create. Optional on update."],
  ["contactInfo", "string", "Required on create. Optional on update."],
  ["image", "file", "Required on create. Optional on update."],
];

const statusCodes = [
  ["200", "Request succeeded."],
  ["201", "Item created."],
  ["400", "Invalid request, such as a missing required multipart field."],
  ["401", "Missing, invalid, or unverifiable bearer token."],
  ["403", "Authenticated caller is not allowed to modify the item."],
  ["404", "Item not found."],
  ["500", "Server error."],
];

const itemShape = `{
  "id": "string",
  "title": "string",
  "description": "string",
  "location": "string",
  "contactInfo": "string",
  "imageUrl": "string",
  "ownerId": "string",
  "ownerName": "string",
  "ownerEmail": "string",
  "createdAt": "string",
  "updatedAt": "string"
}`;

const curlExample = `curl -X POST "https://https://free-backend-neon.vercel.app//api/items" \\
  -H "Authorization: Bearer PLACEHOLDER_GOOGLE_ID_TOKEN" \\
  -F "title=Desk lamp" \\
  -F "description=Working lamp, free to a good home." \\
  -F "location=Downtown" \\
  -F "contactInfo=owner@example.com" \\
  -F "image=@./lamp.jpg"`;

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <main>
      <div className="frame">
        <header>

          <div className="marquee" aria-label="Giveaway tagline">
            <span>let go of what you hoard — give unused things a second life</span>
          </div>
        </header>

        <section className="section" aria-labelledby="auth">
          <h2 className="section-title" id="auth">
            Auth
          </h2>
          <p className="note">
            Every endpoint needs header{" "}
            <code>Authorization: Bearer &lt;google_id_token&gt;</code>.
          </p>
        </section>

        <section className="section" aria-labelledby="endpoints">
          <h2 className="section-title" id="endpoints">
            Endpoints
          </h2>
          <div className="endpoint-list">
            {endpoints.map((endpoint) => (
              <div className="endpoint-row" key={`${endpoint.method}-${endpoint.path}`}>
                <span className="method">{endpoint.method}</span>
                <code>{endpoint.path}</code>
                <span>{endpoint.body === "-" ? "-" : <span className="chip">{endpoint.body}</span>}</span>
                <span className="endpoint-description">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="multipart">
          <h2 className="section-title" id="multipart">
            Multipart
          </h2>

          <div className="field-list">
            {multipartFields.map(([field, type, notes]) => (
              <div className="field-row" key={field}>
                <code>{field}</code>
                <span className="chip">{type}</span>
                <span className="muted">{notes}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          free · {year} · <a href="https://github.com/nurmareko">github.com/nurmareko</a>
        </footer>
      </div>
    </main>
  );
}
