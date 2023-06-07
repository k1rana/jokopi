<div align='center'>

![alt text](./public/icon.png "jokopi")

<h1>Jokopi</h1>
<h3 align="center">Rest API for jokopi app!</h3>

[Demo](https://jokopi-react.vercel.app/) · [Related Projects](#related-projects)

<hr>
<h3 align="center">Powered by Vercel ⚡</h3>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Instalation \& Environments](#instalation--environments)
- [Postman Documentation](#postman-documentation)
- [Table Structure](#table-structure)
- [Related Projects](#related-projects)
- [Contributors](#contributors)
- [License](#license)
- [Report](#report)

## Tech Stack

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,postgres,vercel,firebase)](https://skillicons.dev)

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (for storing data)
- [MongoDB](https://www.mongodb.com/) (for storing token whitelist)
- [Cloudinary](https://cloudinary.com/) (for storing images)
- [JSON Web Token](https://jwt.io/) (authorization)
- [Vercel](https://vercel.com/) (for deploying)
- [Nodemailer](https://nodemailer.com/about/)
- [Firebase Admin](https://github.com/firebase/firebase-admin-node) (for sending remote notification)
- [sharp](https://www.npmjs.com/package/sharp) & [datauri](https://www.npmjs.com/package/datauri) (for converting image format)
- and other npm packages ([morgan](https://www.npmjs.com/package/morgan), [dotenv](https://www.npmjs.com/package/dotenv), bcrypt, [cors](https://www.npmjs.com/package/cors), [multer](https://www.npmjs.com/package/multer))

## Features

- Upload Images
- CRUD (Products, User, Transactions, Promo)
- Whitelisting JWT
- Remote Notification to Android & iOS App

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- SMTP
- [Firebase Account](https://firebase.google.com/)

### Instalation & Environments

1. Clone this repository to your local

   ```bash
   git clone https://github.com/nyannss/jokopi.git
   ```

2. Install dependencies

   ```bash
   cd jokopi && npm install
   ```

3. Setup environments (you can see in `.env.example`)

   - Database server using postgreSQL

     ```env
     DB_HOST = (put your db host)
     DB_PORT = (put your port of db host)
     DB_USER = (put your db username)
     DB_PASS = (put your db password)
     DB_NAME = (put your db  name)
     ```

   - JSON Web Token Secret Key (prefer using random string) [[see more information]](<https://jwt.io/introduction>)

     ```env
     JWT_SECRET_KEY = (put your secret key)
     ```

   - Database server using MongoDB [[you can create account in here]](<https://mongodb.com>)

     ```env
     MONGODB_HOST = (put your mongodb host)
     MONGODB_USER = (put your mongodb user)
     MONGODB_PASS = (put your mongodb password)
     MONGODB_NAME = (put your mongodb database name)
     ```

   - Image server using Cloudinary [[you can create account in here]](<https://cloudinary.com/>)

     ```env
     CLOUDINARY_NAME = (put your cloudinary name)
     CLOUDINARY_KEY = (put your cloudinary key)
     CLOUDINARY_SECRET = (put your cloudinary secret)
     ```

   - SMTP Authentication for sending email (use gmail for free) [[more info]](<https://sendgrid.com/blog/what-is-an-smtp-server/>)

     ```env
     SMTP_HOST = (put your smtp host)
     SMTP_EMAIL = (put your smtp email/username)
     SMTP_PASS = (put your smtp password)
     ```

   - Firebase Admin (generate service-account json and encode base64) [[see more]](<https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments>)

     ```env
     GOOGLE_APPLICATION_CREDENTIALS = (your encoded service-account.json content)
     ```

## Postman Documentation

You can see the documentation from [Postman](https://elements.getpostman.com/redirect?entityId=26209677-a4d5190f-2074-486b-9977-e7fc0911b6d3&entityType=collection) or export it with [json file](/postman.json).

If you using json file, just open your postman and click import.

## Table Structure

For PostgreSQL, You can download table structure (ddl) from [this link](/ddl.sql).

For MongoDB, You just setup and define it to env the database, it will be automatically created by [mongoose](https://www.npmjs.com/package/mongoose).

## Related Projects

- [jokopi-express](https://github.com/nyannss/jokopi-react) - React App
- [jokopi-react-native](https://github.com/nyannss/jokopi-react-native) - Android & iOS Application

## Contributors

- [nyannss](https://github.com/nyannss)

## License

This project using ISC License

## Report

Any error report you can pull request
or contact: <nyannss@proton.me>
