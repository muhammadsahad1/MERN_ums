import mongoose from "mongoose";

const connetDB = async () => {
  try {
     const conn = await mongoose.connect(process.env.MONGO_URI)
     console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error : ====> ${error}`)
    process.exit(1)
  }
}

export default connetDB    