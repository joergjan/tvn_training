import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();

  if (!session) {
    redirect(303, "/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `full_name, username, avatar_url, trainings_profiles ( trainings ( id ) )`
    )
    .eq("id", session.user.id)
    .single();

  const { data: trainings } = await supabase
    .from("trainings")
    .select()
    .order("day", { ascending: true });

  return { session, profile, trainings };
};

export const actions: Actions = {
  update: async ({ request, locals: { supabase, safeGetSession } }) => {
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const avatarUrl = formData.get("avatarUrl") as string;

    const { session } = await safeGetSession();

    const { error } = await supabase.from("profiles").upsert({
      id: session?.user.id,
      full_name: fullName,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    });

    if (error) {
      return fail(500, {
        fullName,
        username,
        avatarUrl,
      });
    }

    return {
      fullName,
      username,
      avatarUrl,
    };
  },
};
