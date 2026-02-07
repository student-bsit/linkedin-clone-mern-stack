import express from 'express';
import { acceptConnection, getConnectionsRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from '../controllers/connection.controller.js';
import isAuth from '../middleware/auth.middleware.js';
const connectionRouter = express.Router();

connectionRouter.post("/send/:id", isAuth, sendConnection)
connectionRouter.get("/accept/:connectionId", isAuth, acceptConnection)
connectionRouter.get("/reject/:connectionId", isAuth, rejectConnection)
connectionRouter.get("/getStatus/:userId", isAuth, getConnectionStatus)
connectionRouter.get("/removeConnection/:userId", isAuth, removeConnection)
connectionRouter.get("/ConnRequests", isAuth, getConnectionsRequests)
connectionRouter.get("/userConnection", isAuth, getUserConnections)


export default connectionRouter;