import { supabase } from "$lib/server/db/supabaseClient";

export async function load() {
  const { data } = await supabase.from("countries").select();

  return {
    countries: data ?? [],
  };
}
