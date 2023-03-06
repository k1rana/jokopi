import promoModel from '../models/promo.model.js';

async function index(req, res) {
  try {
    const result = await promoModel.index(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: 'Promo not found',
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
}

async function store(req, res) {
  try {
    const result = await promoModel.store(req);
    res.status(201).json({
      data: result.rows,
      msg: 'Create Success',
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
}


// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function show(req, res) {
  try {
    const result = await promoModel.show(req);
    if (result.rows.length === 0 ) {
      res.status(404).json({
        msg: 'Data not found'
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
}


// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function update(req, res) {
  try {
    const result = await promoModel.update(req);
    if (result.rows.length === 0 ) {
      res.status(404).json({
        msg: 'Data not found'
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: 'Update success'
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
}

async function destroy(req, res) {
  try {
    const result = await promoModel.destroy(req);
    if (result.rows.length === 0 ) {
      res.status(404).json({
        msg: 'Data not found'
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: 'Data was destroyed'
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
}

export default {
  index,
  show,
  store,
  update,
  destroy
};
