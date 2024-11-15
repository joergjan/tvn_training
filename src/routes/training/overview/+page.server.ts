import { supabase } from "$lib/server/db/supabaseClient";

export async function load() {
  const { data } = await supabase.from("training").select();

  return {
    trainings: data ?? [],
  };
}
