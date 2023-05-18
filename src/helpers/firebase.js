import { applicationDefault, initializeApp } from "firebase-admin/app";

const firebase = initializeApp({
  credential: applicationDefault(),
});

export default firebase;
