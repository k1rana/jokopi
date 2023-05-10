import express from 'express';

import authRouter from './auth.route.js';
import hashMakerRouter from './hashMaker.route.js';
// route files
import productsRouter from './products.route.js';
import promoRouter from './promo.route.js';
import testRouter from './tester.route.js';
import transactionsRouter from './transactions.route.js';
import userPanelRouter from './userPanel.route.js';
import userRouter from './users.route.js';

// routes from express
const routers = express.Router();

routers.use("/apiv1/products", productsRouter); // products
routers.use("/apiv1/users", userRouter); // users
routers.use("/apiv1/promo", promoRouter); // users
routers.use("/apiv1/transactions", transactionsRouter); // users

// week 6
routers.use("/apiv1/hashmaker", hashMakerRouter);
routers.use("/apiv1/auth", authRouter);
routers.use("/apiv1/test", testRouter);

// week 7 (additions)
routers.use("/apiv1/userPanel", userPanelRouter);

routers.get("/", (req, res) => {
  res.status(200).json({
    status: "200",
    msg: "Welcome to Rest API jokopi app!",
    contributors: [
      {
        alias: "nyannss",
        github: "https://github.com/nyannss",
      },
    ],
  });
});

export default routers;
