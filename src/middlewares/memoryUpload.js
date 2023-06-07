import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const limits = 2e6;

const fileFilter = (req, file, cb) => {
  const pattern = /jpg|png|webp|jpeg/i;
  const ext = path.extname(file.originalname);
  if (!pattern.test(ext)) {
    return cb(new Error("Only JPG, PNG, and WebP files are allowed"));
  }
  cb(null, true);
};

const uploader = (req, res, next) => {
  const upload = multer({
    storage,
    limits: {
      fileSize: limits,
    },
    fileFilter,
  }).single("image");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code && err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(422)
          .json({ status: 422, msg: "Image must be below 2mb" });
      }
      return res.status(422).json({ status: 422, msg: "Invalid format type" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ status: 500, msg: err.message });
    }
    next();
  });
};

export default uploader;
