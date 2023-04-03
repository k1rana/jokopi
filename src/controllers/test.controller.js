import uploader from "../helpers/cloudinary.js";

async function testUpload(req, res) {
  try {
    const result = await uploader(req, "test", "id1");
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
}

export default { testUpload };
