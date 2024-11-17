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
      `full_name, username, avatar_url, trainings_profiles ( id, trainings ( id ) )`
    )
    .eq("id", session.user.id)
    .single();

  const { data: trainings } = await supabase
    .from("trainings")
    .select()
    .gte("day", new Date().toISOString().split("T")[0])
    .order("day", { ascending: true });

  return { session, profile, trainings };
};

export const actions: Actions = {
  enrol: async ({ request, locals: { supabase, safeGetSession } }) => {
    const formData = await request.formData();
    const training_id: string = formData.get("training_id") as string;

    const { session } = await safeGetSession();

    const { error } = await supabase.from("trainings_profiles").insert({
      profile_id: session?.user.id,
      training_id: training_id,
    });

    if (error) {
      return fail(500, {
        training_id,
      });
    }

    return {
      training_id,
    };
  },
  unenrol: async ({ request, locals: { supabase, safeGetSession } }) => {
    const formData = await request.formData();
    const trainings_profiles_id: string = formData.get(
      "trainings_profiles_id"
    ) as string;

    const { session } = await safeGetSession();

    const { error } = await supabase
      .from("trainings_profiles")
      .delete()
      .eq("id", trainings_profiles_id);

    if (error) {
      return fail(500, {
        trainings_profiles_id,
      });
    }

    return {
      trainings_profiles_id,
    };
  },
};
