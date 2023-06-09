import crypto from "crypto";

import uploader from "../helpers/cloudinary.js";
import promoModel from "../models/promo.model.js";

async function index(req, res) {
  try {
    const result = await promoModel.index(req);
    const meta = await promoModel.metaIndex(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        meta,
        msg: "Promo not found",
      });
      return;
    }
    res.status(200).json({
      msg: "Success fetch data",
      meta,
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function store(req, res) {
  try {
    const {
      product_id,
      name,
      desc,
      discount,
      coupon_code,
      start_date,
      end_date,
    } = req.body;
    if (
      !product_id ||
      !name ||
      !desc ||
      !discount ||
      !coupon_code ||
      !start_date ||
      !end_date
    )
      return res.status(422).json({
        status: 422,
        msg: "Please input required form",
      });
    if (name.length < 6)
      return res.status(422).json({
        status: 422,
        msg: "Name length minimum is 6",
      });
    if (desc.length < 10)
      return res.status(422).json({
        status: 422,
        msg: "Description length minimum is 10",
      });
    if (coupon_code.length < 6)
      return res.status(422).json({
        status: 422,
        msg: "Coupon code length minimun is 6",
      });
    if (discount < 1 || discount > 100)
      return res.status(422).json({
        status: 422,
        msg: "Invalid discount input (must between 1-100)",
      });

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate > endDate)
      return res.status(422).json({
        status: 422,
        msg: "Invalid event date input",
      });
    const randomString = crypto.randomBytes(3).toString("hex").substring(0, 5);
    const upload = await uploader(req, "promo", randomString);
    req._uploader = upload;
    // console.log(upload);
    const result = await promoModel.store(req);
    res.status(201).json({
      status: 201,
      msg: "Create Success",
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function show(req, res) {
  try {
    const result = await promoModel.show(req.params.promoId);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function update(req, res) {
  try {
    const product = await promoModel.show(req.params.promoId);
    if (product.rows.length < 1)
      res.status(404).json({
        status: 404,
        msg: "Data not found",
      });
    const upload = await uploader(req, "promo", product.rows[0].id);
    req._uploader = upload;

    const result = await promoModel.update(req, product.rows[0]);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "Update success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function destroy(req, res) {
  try {
    const result = await promoModel.destroy(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      msg: "Data destroyed successfully",
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function checkCode(req, res) {
  try {
    const { code } = req.query;
    const result = await promoModel.checkCode(code);
    if (result.rows.length === 0) {
      res.status(404).json({
        status: 404,
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      msg: "Promo code found",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default {
  index,
  show,
  store,
  update,
  destroy,
  checkCode,
};
