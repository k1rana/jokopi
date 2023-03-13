import { Schema } from 'mongoose';

// create schema
const tokenSchema = new Schema({
  token: { type: String, required: true },
  expired_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now() },
});

export default tokenSchema;
