import { createClient } from "@supabase/supabase-js";
import {
  supabaseBucket,
  supabaseKey,
  supabaseUrl,
} from "../../../loadEnvironment";

const supabase = createClient(supabaseUrl!, supabaseKey!);

export const bucket = supabase.storage.from(supabaseBucket!);
