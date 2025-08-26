import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("Please provide valid connection url");
    }

    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connected:", con.connection.name);
    if (con) {
      console.log("mongodb is connected");
    }
  } catch (error) {
    console.log(error);
  }
};
