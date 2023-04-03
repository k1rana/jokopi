import dataUriParser from "datauri/parser.js";
import path from "path";
import sharp from "sharp";

import cloudinary from "../configs/cloudinary.js";

const uploader = async (req, prefix, suffix) => {
  const { file } = req;
  if (!file) return { data: null };

  // mendapatkan buffer dari multer
  const buffer1 = file.buffer;
  const ext = path.extname(file.originalname).toString();

  // buffer konversi menjadi datauri
  const parser = new dataUriParser();
  const buffer = await sharp(buffer1).webp().toBuffer();
  const datauri = parser.format(ext, buffer);

  const filename = `${prefix}-${file.fieldname}-${suffix}`;

  try {
    // upload ke cloudinary
    const result = await cloudinary.uploader.upload(datauri.content, {
      public_id: filename,
      folder: "jokopi",
    });
    return { data: result, msg: "OK" };
  } catch (err) {
    return { data: null, msg: "Upload Failed", err };
  }
};

export default uploader;
