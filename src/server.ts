import express from "express";
import ExpressFormidable from "express-formidable";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/config";
import Logging from "./library/Logging";
// import { v2 as cloudinary } from "cloudinary";

import { NextFunction, Response, Request } from "express";

const app = express();
app.use(ExpressFormidable());
app.use(cors());

// cloudinary.config({
//     cloud_name: config.cloudinary.name,
//     api_key: config.cloudinary.apiKey,
//     api_secret: config.cloudinary.apiSecret,
// });

// Connect to Mongoose
mongoose.set("strictQuery", false);
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
        Logging.info("Connected to mongoDB !!!");
        startServer();
    })
    .catch((error) => {
        Logging.error("Unable to connect : ");
        Logging.error(error);
    });

// Only start server if Mongo Connects
const startServer = () => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        Logging.info(
            `Incomming => Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );
        res.on("finish", () => {
            Logging.info(
                `Incomming => Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
            );
        });

        next();
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Rules of the API
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );

        if (req.method == "OPTIONS") {
            res.header(
                "Access-Control-Allow-Methods",
                "PUT, POST, PATCH, DELETE, GET"
            );
            return res.status(200).json({});
        }

        next();
    });

    // Routes
    //
    //

    // Tests Server
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json("Template Express TypeScript MongoDB");
    });
    app.get("/ping", (req, res, next) => {
        res.status(200).json({ message: "pong" });
    });
    app.post("/upload", (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.files);
        res.status(200).json({ message: req.files });
    });

    // Error
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        const error = new Error("Not found");

        Logging.error(error);

        res.status(404).json({
            message: "Page not found",
        });
    });

    // Listen Server
    http.createServer(app).listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
