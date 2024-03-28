"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const InstaLogs_1 = __importDefault(require("./services/InstaLogs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const wss = (0, http_1.createServer)();
const io = new socket_io_1.Server(wss, {
    cors: {
        origin: "*",
    },
});
const rootPath = process.env.ROOT_PATH ?? "../";
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(rootPath, "public")));
app.use(express_1.default.json());
app.use("/api", routes_1.default);
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "public/assets"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
        }
        else if (path.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        }
    },
}));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
io.on("connection", (socket) => {
    console.log(`[server]: Socket.io client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`[server]: Socket.io client disconnected: ${socket.id}`);
    });
});
InstaLogs_1.default.getInstance().on("onNewEvent", (event) => {
    io.emit("newevent", { event });
});
wss.listen(20000, () => {
    console.log(`[server]: Socket.io server is running at http://localhost:20000`);
});
app.listen(port, () => {
    console.log(`[server]: Express is running at http://localhost:${port}`);
});
