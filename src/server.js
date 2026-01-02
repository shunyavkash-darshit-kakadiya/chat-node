import express from "express";
import http from "http";
import { PORT } from "./configs/environment.config.js";
import { appDb } from "./configs/dbConnection.config.js";
import { cookieParser } from "./middleware/cookieParser.middleware.js";
import appRouter from "./app/app.route.js";
import corsMiddleware from "./middleware/cors.middleware.js";
import { initSocket } from "./configs/socket.config.js";

const app = express();
app.use(express.json());

// const corsOptions = {
//   origin: ["http://localhost:4000", "http://192.168.29.95:4000"],
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(corsMiddleware);

app.use(cookieParser);

//routes define
app.use(appRouter);

//404 Route Handler
app.use((req, res) => {
  res.status(404).send(`404 - Route Not Found ==> ${req.originalUrl}`);
});

// Initialize Socket.io
const server = http.createServer(app);
initSocket(server);

//start the server
server.listen(PORT || 1101, () => {
  console.log(`Server is running on port ${PORT || 1101}`);
});
