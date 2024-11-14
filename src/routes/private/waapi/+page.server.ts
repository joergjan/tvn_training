import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { dev } from "$app/environment";

export const actions: Actions = {
  sendMessage: async ({ request, url }) => {
    try {
      const formData = Object.fromEntries(await request.formData());

      console.log(formData);

      const response = await fetch(`${url.origin}/api/sendMessage`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          chatId: formData.chatId,
          message: formData.message || "",
        }),
      });

      if (response.ok) {
        return { status: 200 };
      } else {
        return fail(500, { message: "Failed to send Message" });
      }
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

      if (response.ok) {
        return { status: 200, data };
      } else {
        return fail(500, { message: "Failed to get ChatId" });
      }
    } catch (e) {
      console.log(e);
      return fail(500, { message: "Failed to get ChatId" });
    }
  },
};
