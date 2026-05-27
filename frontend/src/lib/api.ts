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
        // 开发模式：无 token 时发送 Bearer dev 让后端进入 dev mode
        if (!data.session?.access_token) {
          request.headers.set("Authorization", "Bearer dev-mode-token");
        }
      },
    ],
  },
});

export async function uploadFile(path: string, file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  // 开发模式：手动加 header
  const headers: Record<string, string> = { Authorization: "Bearer dev-mode-token" };
  try {
    const { data } = await getSupabase().auth.getSession();
    if (data.session?.access_token) {
      headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch {
    // supabase 未初始化，使用 dev header
  }

  const response = await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json();
}