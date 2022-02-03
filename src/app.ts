/**
 * Modules imports
 */
import express from "express";
import routes from "./routes";
import notFoundHandlerMiddleware from "./middlewares/notFoundHandler.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
/**
 * init server
 */
const app = express();

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

export default app;
