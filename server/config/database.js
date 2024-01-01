import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database connected successfully`);
    }
    catch(err)
    {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;