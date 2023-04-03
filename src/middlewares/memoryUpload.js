import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const limits = 2e6;

const fileFilter = (req, file, cb) => {
  const pattern = /jpg|png|webp/i;
  const ext = path.extname(file.originalname);
  if (!pattern.test(ext)) {
    return cb(new Error("Only JPG, PNG, and WebP files are allowed"));
  }
  cb(null, true);
};

const uploader = (req, res, next) => {
  const upload = multer({
    storage,
    limits,
    fileFilter,
  }).single("image");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(422).json({ msg: "Invalid format type" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
    next();
  });
};

export default uploader;
