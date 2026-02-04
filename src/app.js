import express from "express";
import router from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import linkRoutes from "./routes/link.routes.js";
import { redirectToOriginal } from "./controllers/link.controller.js";

const app = express();

app.use(express.json());

app.use("/auth", router);
app.use("/links", linkRoutes);

app.get("/", (req,res) => {
  res.send("API running!!");
});

app.get("/:shortCode", redirectToOriginal);

app.use(errorHandler);

export default app;