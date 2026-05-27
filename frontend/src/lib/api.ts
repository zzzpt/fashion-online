import ky from "ky";

import { getSupabase } from "./supabase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = ky.create({
  prefix: BASE_URL,
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        const { data } = await getSupabase().auth.getSession();
        if (data.session?.access_token) {
          request.headers.set("Authorization", `Bearer ${data.session.access_token}`);
        }
      },
    ],
  },
});