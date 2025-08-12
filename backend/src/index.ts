import { serve } from "bun";

const port = Number(process.env.PORT || 3000);

serve({
  port,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Bun backend is running", {
      headers: { "Content-Type": "text/plain" },
    });
  },
});

console.log(`Bun server listening on http://localhost:${port}`);
