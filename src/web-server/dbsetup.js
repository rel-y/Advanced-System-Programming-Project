const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("Missing MONGO_URI env var");

  await mongoose.connect(mongoUri, {serverSelectionTimeoutMS: 10000});

  console.log("MongoDB connected");
}

module.exports = { connectDB };
