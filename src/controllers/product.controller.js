import {
  getProducts as _getProducts,
  getProductDetail as _getProductDetail,
  insertProducts as _insertProducts,
} from "../models/products.model";

async function getProducts(req, res) {
  try {
    const { query } = req;
    const result = await _getProducts(query);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product Tidak Ditemukan",
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

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
const getProductDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await _getProductDetail(params);
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const insertProducts = async (req, res) => {
  try {
    const { body } = req;
    const result = await _insertProducts(body);
    res.status(201).json({
      data: result.rows,
      msg: "Create Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

export default {
  getProducts,
  insertProducts,
  getProductDetail,
};
