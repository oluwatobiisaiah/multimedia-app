import express from "express";
import { notFound } from "./middlewares/errors/notFound";
import { globalErrorHandler } from "./middlewares/errors/errorHandler";
import router from "./fluent-ffmpeg/fluent-ffmpeg.router";
import formData from "express-form-data";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1",router)
app.use(notFound);
app.use(globalErrorHandler)
export default app;
