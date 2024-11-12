import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { dev } from "$app/environment";

export const actions: Actions = {
  sendMessage: async ({ request, url }) => {
    try {
      const formData = Object.fromEntries(await request.formData());

      const response = await fetch(`${url.origin}/api/sendMessage`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          chatId: formData.number,
          message: formData.text || "",
        }),
      });

      return { status: 200 };
    } catch (e) {
      console.log(e);
      return fail(500, { message: "Failed to send Message" });
    }
  },
  getChatId: async ({ request, url }) => {
    try {
      const formData = Object.fromEntries(await request.formData());

      const response = await fetch(
        `${url.origin}/api/getChatId/${formData.number}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      return { status: 200, data };
    } catch (e) {
      console.log(e);
      return fail(500, { message: "Failed to send Message" });
    }
  },
};
