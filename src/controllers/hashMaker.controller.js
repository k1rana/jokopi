import bcrypt from 'bcrypt';

async function generate(req, res) {
  try {
    const result = await bcrypt.hash(req.body.plainText, 15);
    res.status(200).json({
      data: {
        plainText: req.body.plainText,
        result: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default { generate };
