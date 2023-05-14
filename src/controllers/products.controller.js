import crypto from 'crypto';

import uploader from '../helpers/cloudinary.js';
import productModel from '../models/products.model.js';

async function index(req, res) {
  try {
    const metaResult = await productModel.meta(req);
    const page = !isNaN(req.query.page) ? parseInt(req.query.page) : 1;
    if (page < 1 || page > metaResult.totalPage) {
      res.status(404).json({
        msg: "Invalid page",
      });
      return;
    }
    const result = await productModel.index(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        status: 404,
        data: result.rows,
        msg: "Product Tidak Ditemukan",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      msg: "Fetch success",
      meta: metaResult,
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 200,
      msg: "Internal Server Error",
    });
  }
}

async function store(req, res) {
  try {
    const randomString = crypto.randomBytes(3).toString("hex").substring(0, 5);
    const upload = await uploader(req, "product", randomString);
    req._uploader = upload;
    const result = await productModel.store(req);
    res.status(201).json({
      status: 201,
      msg: "Create Success",
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function show(req, res) {
  try {
    const result = await productModel.show(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        status: 404,
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

async function update(req, res) {
  try {
    const data = await productModel.selected(req);
    if (data.rows.length === 0) {
      res.status(404).json({
        status: 404,
        msg: "Product not found",
      });
      return;
    }
    const upload = await uploader(req, "product", req.params.productId);
    req._uploader = upload;
    const result = await productModel.update(req, data);
    res.status(200).json({
      status: 200,
      data: result.rows,
      msg: "Update success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

async function destroy(req, res) {
  try {
    const result = await productModel.destroy(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: result.rows,
      msg: "Data was destroyed",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

async function priceSize(req, res) {
  try {
    const result = await productModel.priceSize();
    if (result.rows.length === 0) {
      res.status(404).json({
        status: 404,
        data: [],
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: result.rows,
      msg: "Success fetch data",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
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
  priceSize,
};
