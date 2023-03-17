import "../../../loadEnvironment";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import {
  supabaseBucket,
  supabaseKey,
  supabaseUrl,
} from "../../../loadEnvironment";

const destinationPath = "uploads/";

export const storage = multer.diskStorage({
  destination: destinationPath,
  filename(req, file, setFilename) {
    const uniquePrefix = crypto.randomUUID();
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
