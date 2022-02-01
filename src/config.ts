export default {
  MONGO_URI: process.env.MONGO_URI as string,
  APP_PORT: parseInt(process.env.APP_PORT as string),
};
