import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );

    mongoose.connection.on("error", (err) =>
      console.log("MongoDB Error:", err)
    );

    mongoose.connection.on("disconnected", () =>
      console.log("Database Disconnected")
    );

    await mongoose.connect(process.env.MONGODB_URI, {
        family: 4, 
        serverSelectionTimeoutMS: 10000,
        });

  } catch (error) {
    console.log("Connection Logic Error:", error);
  }
};
