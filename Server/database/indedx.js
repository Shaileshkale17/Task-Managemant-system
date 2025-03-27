import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const ConnectAPi = async () => {
  try {
    const connectDb = await mongoose.connect(process.env.ConnnectURL);
    console.log("Connect URL : ", connectDb.connection.host);
  } catch (error) {
    console.log("ERROR:", error);
    process.exit(1);
  }
};

export default ConnectAPi;
