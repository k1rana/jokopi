import db from '../helpers/postgre.js';

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort === "asc" ? "ASC" : "DESC"; // sort with query ?sort=

    let sortColumn;
    const { query } = req;
    switch (req.query.orderBy || null) {
      case "name":
        sortColumn = "name";
        break;

      case "start_date":
        sortColumn = "start_date";
        break;

      case "end_date":
        sortColumn = "end_date";
        break;

      case "discount":
        sortColumn = "discount";
        break;

      default:
        sortColumn = "id";
        break;
    }

    let searchSql = "%";
    if (req.query.searchByName !== undefined) {
      searchSql = "%" + req.query.searchByName + "%";
    }

    let available = "";
    if (req.query.available === "true") {
      available = " AND start_date <= NOW() AND end_date >= NOW()";
    }

    // const limit = `LIMIT ${!isNaN(req.query.limit) ? req.query.limit : 10}`;
    let sql = `SELECT 
    p.id, 
    p.name,
    p.desc,
    c.price as original_price,
    c.price - (c.price* p.discount/100) as discounted_price,
    p.discount, 
    p.start_date,
    p.end_date,
    p.coupon_code,
    c.img as product_img,
    c.name as product_name,
    p.product_id FROM promo p 
    LEFT JOIN products c ON p.product_id = c.id
    WHERE p.id != 0 AND (p.name ILIKE $1 OR p.desc ILIKE $1 OR c.name ILIKE $1)
    ${available}
    ORDER BY ${sortColumn} ${sort}`;

    let values = [searchSql];

    // pagination

    let limitQuery = parseInt(query.limit);
    if (isNaN(limitQuery)) limitQuery = 10;
    if (limitQuery > 50) limitQuery = 50;

    sql += ` LIMIT $${values.length + 1}`;
    values.push(limitQuery);

    let pageQuery = parseInt(query.page);
    if (isNaN(pageQuery)) {
      pageQuery = "1";
    }
    const offset = (pageQuery - 1) * limitQuery;
    sql += ` OFFSET $${values.length + 1}`;
    values.push(offset);

    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function metaIndex(req) {
  return new Promise((resolve, reject) => {
    let filters = {};
    let searchSql = "%";
    if (req.query.searchByName !== undefined) {
      searchSql = "%" + req.query.searchByName + "%";
      filters = { ...filters, searchByName: req.query.searchByName };
    }

    let available = "";
    if (req.query.available === "true") {
      available = " AND start_date <= NOW() AND end_date >= NOW()";
      filters = { ...filters, available: "true" };
    }
    let values = [searchSql];
    let sql = `SELECT COUNT(*) as total_count
    FROM promo p
    LEFT JOIN products c ON p.product_id = c.id
    WHERE p.id != 0 AND (p.name ILIKE $1 OR p.desc ILIKE $1 OR c.name ILIKE $1)
    ${available}`;

    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const totalData = result.rows[0].total_count;
      let limitQuery = parseInt(req.query.limit);
      if (isNaN(limitQuery)) limitQuery = 10;
      if (limitQuery > 50) limitQuery = 50;
      if (!isNaN(req.query.limit)) {
        filters = { ...filters, limit: limitQuery };
      }
      const totalPage = Math.ceil(totalData / limitQuery);

      let pageQuery = parseInt(req.query.page);
      if (isNaN(pageQuery)) {
        pageQuery = "1";
      }

      let next = null;
      let prev = null;

      let urlprev = {
        ...filters,
        ...{ page: pageQuery - 1 },
      };

      let urlnext = {
        ...filters,
        ...{ page: pageQuery + 1 },
      };

      let prevUrl = new URLSearchParams(urlprev);
      let nextUrl = new URLSearchParams(urlnext);

      if (pageQuery > 1 && totalData > 1) {
        prev = `/products?${prevUrl}`;
      }
      if (pageQuery < totalPage) {
        next = `/products?${nextUrl}`;
      }

      const meta = {
        page: pageQuery.toString(),
        prev,
        next,
        totalData: result.rows[0].total_count,
      };
      resolve(meta);
    });
  });
}

const store = (req) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO promo 
      ("name", "desc", discount, start_date, end_date, coupon_code, size, delivery_methods, product_id) 
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;

    const data = req.body;
    const values = [
      data.name,
      data.desc,
      data.discount,
      data.start_date,
      data.end_date,
      data.coupon_code,
      data.size,
      data.delivery_methods,
      data.product_id,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const checkCode = (code) => {
  return new Promise((resolve, reject) => {
    const values = [code];
    const sql = `SELECT 
    p.id, 
    p.name,
    p.desc,
    p.discount, 
    c.price as original_price,
    c.price - (c.price* p.discount/100) as discounted_price,
    p.start_date,
    p.end_date,
    p.coupon_code,
    p.product_id FROM promo p
    LEFT JOIN products c ON p.product_id = c.id
    WHERE p.coupon_code = $1 AND p.start_date <= NOW() AND p.end_date >= NOW()`;
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

function show(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    p.id, 
    p.name,
    p.desc,
    p.discount, 
    p.start_date,
    p.end_date,
    p.coupon_code,
    p.product_id FROM promo p 
    LEFT JOIN products c ON p.product_id = c.id
    WHERE p.id = $1`;
    const values = [req.params.promoId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function update(req) {
  return new Promise((resolve, reject) => {
    const data = req.body;
    const { promoId } = req.params;
    const sql = `
    UPDATE promo SET 
    "name" = $1, 
    "desc" = $2, 
    discount = $3, 
    start_date = $4, 
    end_date = $5, 
    coupon_code = $6, 
    size = $7, 
    delivery_methods = $8, 
    product_id = $9 
    WHERE id = $10
    RETURNING *`;
    const values = [
      data.name,
      data.desc,
      data.discount,
      data.start_date,
      data.end_date,
      data.coupon_code,
      data.product_id,
      promoId,
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
    const { promoId } = req.params;
    const sql = `DELETE FROM promo WHERE id = $1 RETURNING *`;
    const values = [promoId];
    db.query(sql, values, (error, result) => {
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
  show,
  store,
  update,
  checkCode,
  metaIndex,
  destroy,
};
