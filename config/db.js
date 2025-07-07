import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected Successfully")
    } catch (error) {
        console.log(error)
    }
};