/**
 * otp-email.functions.ts
 *
 * TanStack Start server function bridge.
 * The client calls sendOTPEmailFn() — it runs on the server, never in the browser.
 * This is why there's no CORS issue.
 */

import { createServerFn } from "@tanstack/react-start";
import { sendBrevoOTPEmail } from "./otp-email.server";

export const sendOTPEmailFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown): { email: string; otp: string } => {
      if (
        typeof data !== "object" ||
        data === null ||
        typeof (data as Record<string, unknown>)["email"] !== "string" ||
        typeof (data as Record<string, unknown>)["otp"] !== "string"
      ) {
        throw new Error("Invalid input: email and otp are required strings.");
      }
      const { email, otp } = data as { email: string; otp: string };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email address.");
      }
      if (!/^\d{6}$/.test(otp)) {
        throw new Error("Invalid OTP format.");
      }
      return { email, otp };
    },
  )
  .handler(
    async ({ data }): Promise<{ ok: boolean; error?: string }> => {
      return sendBrevoOTPEmail(data.email, data.otp);
    },
  );
