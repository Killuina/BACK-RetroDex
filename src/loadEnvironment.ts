import * as dotenv from "dotenv";

dotenv.config();

export const {
  JWT_SECRET: jwtSecret,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_BUCKET: supabaseBucket,
} = process.env;
