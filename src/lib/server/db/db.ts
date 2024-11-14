// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { SUPABASE_URL } from "$env/static/private";

const db = drizzle(SUPABASE_URL);

const result = await db.execute("select 1");
