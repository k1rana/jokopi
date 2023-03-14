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
        data: result.rows,
        msg: "Product Tidak Ditemukan",
      });
      return;
    }

    res.status(200).json({
      meta: metaResult,
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
    const result = await productModel.store(req);
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
}

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function show(req, res) {
  try {
    const result = await productModel.show(req);
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
    const data = await productModel.selected(req);
    if (data.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    const result = await productModel.update(req, data);
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
    const result = await productModel.destroy(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "Data was destroyed",
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
};
