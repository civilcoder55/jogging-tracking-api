/**
 * Load env variables
 */
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Modules imports
 */
import logger from "./utils/logger.util";
import * as db from "./database";
import app from "./app";
import config from "./config";

/**
 * App Variables
 */
const APP_PORT: number = config.APP_PORT;

/**
 * connect to database
 */
db.connect();

/**
 * start server
 */
app.listen(APP_PORT || 3003, () => {
  logger.info(`[*] Server running on port ${APP_PORT} on pid ${process.pid}.`);
});
