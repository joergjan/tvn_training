import { fail, json } from "@sveltejs/kit";
import { WAAPI_TOKEN, WAAPI_CLIENT, API_KEY } from "$env/static/private";

function formatSwissPhoneNumber(phone: string) {
  // Remove all non-digit characters
  phone = phone.replace(/\D/g, "");

  // Check and replace country code if it starts with 00 or +
  if (phone.startsWith("0041")) {
    phone = phone.replace(/^0041/, "41");
  } else if (phone.startsWith("41")) {
    // Already starts with the correct country code
  } else if (phone.startsWith("0")) {
    phone = "41" + phone.slice(1);
  }

  return phone;
}

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

  const number = formatSwissPhoneNumber(params.number);

  if (number) {
    try {
      const url = `https://waapi.app/api/v1/instances/${WAAPI_CLIENT}/client/action/get-number-id`;
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

      return json(numberId, { status: response.status });
    } catch (e) {
      return json("failed to send Message", { status: 500 });
    }
  } else {
    return json("bad request", { status: 400 });
  }
}
