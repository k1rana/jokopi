import db from '../helpers/postgre.js';

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort == "desc" ? "DESC" : "ASC"; // sort with query ?sort=
    let sortColumn;
    switch (req.query.orderBy || null) {
      case "name":
        sortColumn = "name";
        break;

      case "price":
        sortColumn = "price";
        break;

      case "category":
        sortColumn = "category_id";
        break;

      default:
        sortColumn = "p.id";
        break;
    }
    let searchSql = "%";
    if (req.query.searchByName !== undefined) {
      searchSql = "%" + req.query.searchByName + "%";
    }
    const qcategory =
      !isNaN(req.query.category) &&
      req.query.category &&
      req.query.category !== ""
        ? ` AND category_id = ${req.query.category}`
        : "";

    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const limitsql = " LIMIT $2 OFFSET $3";

    const sql = `SELECT 
    p.id, 
    p.name, 
    p.price,
    p.img, 
    p.category_id, 
    c.name AS category_name FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.name ILIKE $1
    ${qcategory}
    ORDER BY ${sortColumn} ${sort}
    ${limitsql}`;

    const values = [searchSql, limit, offset];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function meta(req) {
  return new Promise((resolve, reject) => {
    const q = req.query;
    let searchSql = "%";
    if (req.query.searchByName !== undefined) {
      searchSql = "%" + req.query.searchByName + "%";
    }
    const qcategory =
      !isNaN(req.query.category) && req.query.category
        ? ` AND category_id = ${req.query.category}`
        : "";
    const sql = `SELECT COUNT(*) AS totaldata FROM products p WHERE p.name ILIKE $1 ${qcategory}`;

    const values = [searchSql];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const totalData = parseInt(result.rows[0].totaldata);
      const page = parseInt(q.page) || 1;
      const limit = !isNaN(req.query.limit) ? parseInt(req.query.limit) : 10;
      const totalPage = Math.ceil(totalData / limit);
      let add = "";
      if (req.query.limit != undefined) add += `&limit=${limit}`;
      if (req.query.searchByName != undefined)
        add += `&searchByName=${req.query.searchByName}`;
      if (req.query.orderBy != undefined)
        add += `&orderBy=${req.query.orderBy}`;
      if (req.query.sort != undefined) add += `&sort=${req.query.sort}`;
      let next = `/products?page=${
        parseInt(!isNaN(q.page) ? q.page : "1") + 1
      }`; // coba dicari
      let prev = `/products?page=${parseInt(q.page) - 1}`; // coba dicari

      next += add;
      prev += add;
      if (page === 1) prev = null;
      if (page === totalPage) next = null;

      const meta = {
        totalData,
        prev,
        next,
        currentPage: page,
        totalPage,
      };

      resolve(meta);
    });
  });
}

const store = (req) => {
  return new Promise((resolve, reject) => {
    const fileLink = !req.file ? null : req._uploader.data?.secure_url;
    const sql = `INSERT INTO products 
      (name, price, category_id, img, "desc") 
    VALUES 
      ($1, $2, $3, $4, $5) 
    RETURNING *`;

    const data = req.body;
    const values = [
      data.name,
      data.price,
      data.category_id,
      fileLink,
      data.desc,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

function show(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    p.id, 
    p.name, 
    p.price, 
    p.category_id,
    p.desc,
    p.img, 
    c.name AS category_name FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1`;
    const values = [req.params.productId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function selected(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM products p 
    WHERE p.id = $1`;
    const values = [req.params.productId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function update(req, firstData) {
  return new Promise((resolve, reject) => {
    const { name, price, category_id, desc } = req.body;
    const data = firstData.rows[0];
    const updatedName = name == undefined ? data.name : name;
    const updatedPrice = price == undefined ? data.price : price;
    const updatedDesc = desc == undefined ? data.desc : desc;
    const updatedCat =
      category_id == undefined ? data.category_id : category_id;
    const fileLink = !req.file ? data.img : req._uploader.data?.secure_url;
    console.log(updatedDesc);

    const { productId } = req.params;
    const sql = `UPDATE products SET name = $1, price = $2, category_id = $3, img = $4, "desc" = $5  WHERE id = $6 RETURNING *`;
    const values = [
      updatedName,
      updatedPrice,
      updatedCat,
      fileLink,
      updatedDesc,
      productId,
    ];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function destroy(req) {
  return new Promise((resolve, reject) => {
    const { productId } = req.params;
    const sql = `DELETE FROM products WHERE id = $1 RETURNING *`;
    const values = [productId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function priceSize() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM product_size ORDER BY id ASC`;
    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

export default {
  index,
  meta,
  show,
  selected,
  store,
  update,
  destroy,
  priceSize,
};
