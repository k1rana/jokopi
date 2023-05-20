import admin from 'firebase-admin';

const base64Credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const decodedCredentials = Buffer.from(base64Credentials, "base64").toString(
  "utf-8"
);
const serviceAccount = JSON.parse(decodedCredentials);

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebase;
