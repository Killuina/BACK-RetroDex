import multer from "multer";
import crypto from "crypto";
import path from "path";

const destinationPath = "uploads/";

const storage = multer.diskStorage({
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
