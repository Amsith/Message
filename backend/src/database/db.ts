import mongoose from "mongoose";
import configs from "../configs/config";
// import mongoose from 'mongoose';


const connectDatabase = async () => {
    try {
        await mongoose.connect(configs.MONGODB_URI)
        console.log('Database Connected');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process if the database connection fails
    }
};


export default connectDatabase;

// Write a sample document to a test collection
// const testCollection = db.collection("test");
// await testCollection.insertOne({ message: "Hello, MongoDB!" });

// console.log("Sample document inserted into 'test' collection");
