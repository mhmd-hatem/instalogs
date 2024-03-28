import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import rootRouter from "./routes";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import InstaLogs from "./services/InstaLogs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const wss = createServer();

const io = new Server(wss, {
  cors: {
    origin: "*",
  },
});
const rootPath = process.env.ROOT_PATH ?? "../";

app.use(cors());
app.use(express.static(path.join(rootPath, "public")));
app.use(express.json());
app.use("/api", rootRouter);
app.use(
  "/assets",
  express.static(path.join(__dirname, "public/assets"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
io.on("connection", (socket) => {
  console.log(`[server]: Socket.io client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[server]: Socket.io client disconnected: ${socket.id}`);
  });
});

InstaLogs.getInstance().on("onNewEvent", (event) => {
  io.emit("newevent", { event });
});

wss.listen(20000, () => {
  console.log(
    `[server]: Socket.io server is running at http://localhost:20000`
  );
});
app.listen(port, () => {
  console.log(`[server]: Express is running at http://localhost:${port}`);
});
