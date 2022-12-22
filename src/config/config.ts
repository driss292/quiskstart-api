import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// MongoDB
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = "mongodb://localhost:27017";

// Cloudinary
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

// Server
const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;

export const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
    // cloudinary: {
    //     name: CLOUDINARY_NAME,
    //     apiKey: CLOUDINARY_API_KEY,
    //     apiSecret: CLOUDINARY_API_SECRET,
    // },
};
export default cloudinary;
