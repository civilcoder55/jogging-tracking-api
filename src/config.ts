export default {
  MONGO_URI: process.env.MONGO_URI as string,
  APP_PORT: parseInt(process.env.APP_PORT as string),
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL as string,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as string,
};
