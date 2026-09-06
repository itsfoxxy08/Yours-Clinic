import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
const brevoKey = env["VITE_BREVO_API_KEY"] || process.env["VITE_BREVO_API_KEY"] || "";
const senderEmail = env["VITE_ADMIN_SENDER_EMAIL"] || process.env["VITE_ADMIN_SENDER_EMAIL"] || "yoursclinicnoreply@yahoo.com";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    define: {
      "process.env.VITE_BREVO_API_KEY": JSON.stringify(brevoKey),
      'process.env["VITE_BREVO_API_KEY"]': JSON.stringify(brevoKey),
      'import.meta.env["VITE_BREVO_API_KEY"]': JSON.stringify(brevoKey),
      "process.env.VITE_ADMIN_SENDER_EMAIL": JSON.stringify(senderEmail),
      'process.env["VITE_ADMIN_SENDER_EMAIL"]': JSON.stringify(senderEmail),
      'import.meta.env["VITE_ADMIN_SENDER_EMAIL"]': JSON.stringify(senderEmail),
    },
  },
});
