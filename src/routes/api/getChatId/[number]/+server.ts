import { fail, json } from "@sveltejs/kit";
import { WAAPI_TOKEN, WAAPI_CLIENT, API_KEY } from "$env/static/private";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  /*
  if (request.headers.get("API-KEY") != API_KEY) {
    return json({
      status: 401,
      message: "UNAUTHORIZED REQUEST",
    });
  }
  */

  const number = params.number;

  if (number) {
    try {
      const url = `https://waapi.app/api/v1/instances/id/${WAAPI_CLIENT}/action/get-number-id`;
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${WAAPI_TOKEN}`,
        },
        body: JSON.stringify({
          number,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      const numberId: string = data.data.data.numberId._serialized;

      if (response.ok) {
        return json(numberId, { status: response.status });
      } else {
        return json(numberId, { status: response.status });
      }
    } catch (e) {
      return json("failed to send Message", { status: 500 });
    }
  } else {
    return json("bad request", { status: 400 });
  }
}
