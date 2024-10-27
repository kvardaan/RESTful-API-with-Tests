import express from "express"

import { rootRouter } from "./routes/index"
import loggingMiddlware from "./middleware/logging.middleware"

const app = express()

app.use(express.json())

app.use(loggingMiddlware)

app.use("/api/v1", rootRouter)

export default app
