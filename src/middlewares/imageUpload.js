import multer, { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    // file selalu gambar
    const dest = "./public/images";
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // gambar product: images-timestamp.ekstensi
    // gambar profile: images-userId-timestamps.ekstensi
    const filename = `images-${Date.now()}${extname(file.originalname)}`;
    cb(null, filename);
  },
});

const limits = 2e6; // limit max upload

const fileFilter = (req, file, cb) => {
  const pattern = /jpg|png/i;
  const ext = extname(file.originalname);
  if (!pattern.test(ext)) return cb(new Error("Ekstensi harus png/jpg"), false);
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export function singleUpload(fieldName) {
  return upload.single(fieldName);
}
export function multiUpload(fieldName, maxCount) {
  return upload.array(fieldName, maxCount);
}
export function multiFieldUpload(fieldList) {
  return upload.fields(fieldList);
}
