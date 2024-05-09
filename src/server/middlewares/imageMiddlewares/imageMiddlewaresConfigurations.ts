import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import path from "path";
import {
  supabaseBucket,
  supabaseKey,
  supabaseUrl,
} from "../../../loadEnvironment.js";

const destinationPath = "uploads/";

export const storage = multer.diskStorage({
  destination: destinationPath,
  filename(req, file, setFilename) {
    const uniquePrefix = Date.now();
    const extension = path.extname(file.originalname);

    setFilename(null, `${uniquePrefix}-${file.fieldname}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5000000, fieldNameSize: 15 },
});

const supabase = createClient(supabaseUrl!, supabaseKey!);

export const bucket = supabase.storage.from(supabaseBucket!);
