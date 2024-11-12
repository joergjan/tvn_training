import { fail, json } from "@sveltejs/kit";
import { WAAPI_TOKEN, WAAPI_CLIENT, API_KEY } from "$env/static/private";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
  /*
  if (request.headers.get("API-KEY") != API_KEY) {
    return json({
      status: 401,
      message: "UNAUTHORIZED REQUEST",
    });
  }
  */

  const body = await request.json();

  const message = body.message;
  const chatId = body.chatId;

  if (message && chatId) {
    try {
      const url = `https://waapi.app/api/v1/instances/${WAAPI_CLIENT}/client/action/send-message`;
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${WAAPI_TOKEN}`,
        },
        body: JSON.stringify({
          chatId,
          message,
        }),
      };
      const response = await fetch(url, options);

      return json("success", { status: 201 });
    } catch (e) {
      return json("failed to send Message", { status: 500 });
    }
  } else {
    return json("bad request", { status: 400 });
  }
}
