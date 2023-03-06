import userModel from '../models/users.model.js';

async function index(req, res) {
  try {
    const result = await userModel.index(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: 'User not found',
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
    const result = await userModel.store(req);
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

async function show(req, res) {
  try {
    const result = await userModel.show(req);
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


// // params => query (search, filter, sort, paginasi) & path (get detail)
// // query => req.query
// // path => req.params
// async function update(req, res) {
//   try {
//     const result = await productModel.update(req);
//     if (result.rows.length === 0 ) {
//       res.status(404).json({
//         msg: 'Data not found'
//       });
//       return;
//     }
//     res.status(200).json({
//       data: result.rows,
//       msg: 'Update success'
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: 'Internal Server Error',
//     });
//   }
// }

// async function destroy(req, res) {
//   try {
//     const result = await productModel.destroy(req);
//     if (result.rows.length === 0 ) {
//       res.status(404).json({
//         msg: 'Data not found'
//       });
//       return;
//     }
//     res.status(200).json({
//       data: result.rows,
//       msg: 'Data was destroyed'
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: 'Internal Server Error',
//     });
//   }
// }

export default {
  index,
  show,
  store,
  // update,
  // destroy
};
