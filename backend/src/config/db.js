import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected");
  } catch (err) {
    console.log(`DB Error: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
