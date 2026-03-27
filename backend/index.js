import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.config.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import postRouter from './routes/post.router.js';
import connectionRouter from './routes/connection.route.js';
import http from 'http'
import { Server } from 'socket.io';
import notificationRouter from './routes/notification.route.js';
dotenv.config();

const app = express();

let server = http.createServer(app)
export const io = new Server(server, {
    cors: ({
        origin: "http://localhost:5173",
        credentials: true
    })
})

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

let port = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("Deploy successfully")
})


app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
app.use("/api/notification", notificationRouter)

export const userSocketMap = new Map()

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(userSocketMap)

    });

    socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

});

});





server.listen(port, () => {
    connectDB();
    console.log(`server is running on port ${port}`)
}
)
