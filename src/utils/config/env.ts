import { config as conf } from "dotenv"

conf()

const _config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
}

export const config = Object.freeze(_config)
