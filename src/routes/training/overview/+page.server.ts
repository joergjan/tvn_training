import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();

  if (!session) {
    redirect(303, "/");
  }

  const { data: trainings } = await supabase
    .from("trainings")
    .select()
    .order("day", { ascending: true });

  const { data: profiles } = await supabase
    .from("profiles")
    .select(`full_name, username, trainings_profiles ( trainings ( day ) )`);

  return { session, trainings, profiles };
};
