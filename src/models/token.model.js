import { model } from 'mongoose';

import tokenSchema from '../schemas/token.schema.js';

const Token = model("tokens", tokenSchema);

async function store({ token, expired_at }, cb) {
  try {
    await Token.create({
      token,
      expired_at,
    });
    cb(null, {
      message: "Token added to MongoDB",
    });
  } catch (err) {
    cb(err, null);
  }
}

async function get(token) {
  try {
    const tokenData = await Token.findOne({ token });
    return tokenData;
  } catch (error) {
    console.log(error);
  }
}

async function destroy(token) {
  try {
    const tokenData = await Token.findOneAndRemove({ token });
    return tokenData;
  } catch (error) {
    console.log(error);
  }
}

export default { store, get, destroy };
