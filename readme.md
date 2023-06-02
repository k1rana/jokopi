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
- Remote Notification to Android & iOS App

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,postgres,vercel,firebase)](https://skillicons.dev)

- Node.js
- Express.js
- PostgreSQL (for storing data)
- MongoDB (for storing token whitelist)
- Cloudinary (for storing images)
- JSON Web Token (authorization)
- Vercel (for deploying)
- Nodemailer
- Firebase Admin (for sending remote notification)
- sharp & datauri (for converting image format)
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

   - SMTP Authentication for sending email (use gmail for free) [[more info]](<https://sendgrid.com/blog/what-is-an-smtp-server/>)

     ```env

    SMTP_HOST = (put your smtp host)
    SMTP_EMAIL = (put your smtp email/username)
    SMTP_PASS = (put your smtp password)

     ```env

   - Firebase Admin (generate service-account json and encode base64) [[see more]](<https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments>)

     ```env

     GOOGLE_APPLICATION_CREDENTIALS = (your encoded service-account.json content)
     ```

## Postman Documentation

You can see the documentation from [Link 1]([https://](https://elements.getpostman.com/redirect?entityId=26209677-a4d5190f-2074-486b-9977-e7fc0911b6d3&entityType=collection)) or [Link 2](https://).

## Table Structure

You can download table structure (sql) from [this link](https://) or [this one](https://).

For MongoDB, You just setup and define it to env the database, it will be automatically created by mongoose.

## License

This project using ISC License

## Report

Any error report you can pull request
or contact: <nyannss@proton.me>
