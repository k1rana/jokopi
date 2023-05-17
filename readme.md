<div align='center'>

![alt text](./public/icon.png "jokopi")

<h1>Jokopi</h1>
<h3 align="center">Rest API for jokopi app!</h3>

Related: [React](https://github.com/nyannss/jokopi-react) | [React Native](https://github.com/nyannss/jokopi-react-native)

<hr>
<h3 align="center">Powered by Vercel ⚡</h3>
</div>

## Docs

- [Docs](#docs)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Postman Documentation](#postman-documentation)
- [Table Structure](#table-structure)
- [License](#license)
- [Report](#report)

## Features

- Upload Images
- CRUD (Products, User, Transactions)
- Whitelisting JWT

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,postgres,vercel)](https://skillicons.dev)

- Node.js
- Express.js
- PostgreSQL (for storing data)
- MongoDB (for storing token whitelist)
- Cloudinary (for storing images)
- JSON Web Token (authorization)
- Vercel (for deploying)
- sharp & datauri (for converting image)
- and other npm packages (morgan, dotenv, bcrypt, cors, multer)

## Installation

1. Clone this repository to your local

   ```
   git clone https://github.com/nyannss/jokopi.git
   ```

2. Install dependencies

   ```
   cd jokopi && npm install
   ```

3. Setup environments (you can see in `.env.example`)

   - Database server using postgreSQL

     ```
     DB_HOST = (put your db host)
     DB_PORT = (put your port of db host)
     DB_USER = (put your db username)
     DB_PASS = (put your db password)
     DB_NAME = (put your db  name)
     ```

   - JSON Web Token Secret Key (prefer using random string) [[see more information]](<https://jwt.io/introduction>)

     ```
     JWT_SECRET_KEY = (put your secret key)
     ```

   - Database server using MongoDB [[you can create account in here]](<https://mongodb.com>)

     ```
     MONGODB_HOST = (put your mongodb host)
     MONGODB_USER = (put your mongodb user)
     MONGODB_PASS = (put your mongodb password)
     MONGODB_NAME = (put your mongodb database name)
     ```

   - Image server using Cloudinary [[you can create account in here]](<https://cloudinary.com/>)

     ```
     CLOUDINARY_NAME = (put your cloudinary name)
     CLOUDINARY_KEY = (put your cloudinary key)
     CLOUDINARY_SECRET = (put your cloudinary secret)
     ```

## Postman Documentation

You can download the documentation from [this link](https://) or [this one](https://).

## Table Structure

You can download table structure (sql) from [this link](https://) or [this one](https://).

For MongoDB, You just setup and define it to env the database, it will be automatically created by mongoose.

## License

This project using ISC License

## Report

Any error report you can pull request
or contact: nyannss@proton.me
