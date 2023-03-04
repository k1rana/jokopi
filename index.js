import express from 'express'; // express js
const app = express();

import dotenv from 'dotenv'; // enviroment
dotenv.config();
const { APP_PORT } = process.env;

app.use(express.json());

// using public folders
app.use('/', express.static('public'));

// routes
import routers from './src/routers/index.js';
app.use(routers);


// start server
app.listen(APP_PORT || 8080, () =>{
  console.log(`Server running at port ${APP_PORT}`);
});
