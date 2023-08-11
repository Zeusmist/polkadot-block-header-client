import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
  BATCH_SIZE: process.env.BATCH_SIZE || 5,
};

export default config;
