// src/routes/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  url,
  locals: { safeGetSession },
}) => {
  const { session } = await safeGetSession();

  // if the user is already logged in return them to the account page
  if (session) {
    redirect(303, "/profile");
  }

  return { url: url.origin };
};

export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return fail(400, { message: error.message });
    } else {
      redirect(303, "/");
    }
  },
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

    if (!validEmail) {
      return fail(400, {
        message: "Please enter a valid email address",
      });
    }
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return fail(400, { message: error.message });
    } else {
      redirect(303, "/profile");
    }
  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
      await supabase.auth.signOut();
      redirect(303, "/");
    }
  },
};
