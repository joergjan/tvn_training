import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  sendMessage: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());

      const response = await fetch("http://localhost:5173/api/sendMessage", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          chatId: "41774574801@c.us",
          message: formData.text || "",
        }),
      });

      return { status: 200 };
    } catch (e) {
      console.log(e);
      return fail(500, { message: "Failed to send Message" });
    }
  },
  getChatId: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());

      const response = await fetch(
        `http://localhost:5173/api/getChatId/${formData.number}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );

      return { status: 200 };
    } catch (e) {
      console.log(e);
      return fail(500, { message: "Failed to send Message" });
    }
  },
};
