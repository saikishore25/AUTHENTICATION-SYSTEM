// dropGoogleIdIndex.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  try {
    const result = await mongoose.connection.collection("users").dropIndex("googleId_1");
    console.log("✅ Index dropped:", result);
  } catch (err) {
    console.error("❌ Error dropping index:", err.message);
  }

  await mongoose.disconnect();
};

run();
