/**
 * Load env variables
 */
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Modules imports
 */
import express from "express";
import logger from "./utils/logger.util";
import * as db from "./database";
import routes from "./routes";
import config from "./config";
import notFoundHandlerMiddleware from "./middlewares/notFoundHandler.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";

/**
 * connect to database
 */
db.connect();

/**
 * init server
 */
const app = express();

/**
 * App Variables
 */
const APP_PORT: number = config.APP_PORT;

/**
 *  app middlewares
 */
app.use(express.json());

/**
 * Register app routes
 */
app.use("/api/v1", routes);

/**
 * Global error handlers
 */
app.use(notFoundHandlerMiddleware); // for not exists routes
app.use(errorHandlerMiddleware); // for handling errors

/**
 * start server
 */
app.listen(APP_PORT || 3003, () => {
  logger.info(`[*] Server running on port ${APP_PORT} on pid ${process.pid}.`);
});
