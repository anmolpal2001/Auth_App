import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database.js";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import firstMiddleware from "./middlewares/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(firstMiddleware);

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
