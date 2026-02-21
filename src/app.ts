import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoute.ts";
import dotenv from "dotenv";
import taskRouter from "./routes/taskRoutes.ts";
dotenv.config();

const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use('/api/tasks', taskRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
