import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("success");
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    process.exit(1);
  }
};


export default connectDB;