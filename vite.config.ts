import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    define: {
      "process.env.VITE_BREVO_API_KEY": JSON.stringify(
        env["VITE_BREVO_API_KEY"] || process.env["VITE_BREVO_API_KEY"] || ""
      ),
      "process.env.VITE_ADMIN_SENDER_EMAIL": JSON.stringify(
        env["VITE_ADMIN_SENDER_EMAIL"] || process.env["VITE_ADMIN_SENDER_EMAIL"] || "yoursclinicnoreply@yahoo.com"
      ),
    },
  },
});
