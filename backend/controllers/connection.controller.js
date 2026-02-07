
import Connection from "../model/connection.model.js";
import User from "../model/user.model.js";
import { io, userSocketMap } from '../index.js'
import Notification from "../model/notification.model.js";

export const sendConnection = async (req, res) => {
    try {
        const {id} = req.params;
        const sender = req.userId;

        if (sender === id) {
            return res.status(400).json({ message: "you cannot send request yourself" })
        }
        const user = await User.findById(sender)
        if (user.connections.includes(id)) {
            return res.status(400).json({ message: "you are already connected" })
        }

        let existingConnetion = await Connection.findOne({
            sender,
            reciever: id,
            status: "pending"
        })
        if (existingConnetion) {
            return res.status(400).json({ message: "request already exist" })
        }

        const newRequest = await Connection.create({
            sender,
            reciever: id,

        })

        let recieverSocketId = userSocketMap.get(id);
        let senderSocketId = userSocketMap.get(sender)

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: sender, newStatus: "recieved" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: id, newStatus: "pending" })
        }

        return res.status(200).json(newRequest)
    } catch (error) {
        return res.status(500).json({ message: `send connection error ${error}` })
    }
}

export const acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;
        let connection = await Connection.findById(connectionId)
        if (!connection) {
            return res.status(500).json({ message: 'connection does not exist' })
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }


        connection.status = "accepted"
        let notification = await Notification.create({
            reciever: connection.sender,
            type: "connectionAccepted",
            relatedUser: req.userId,
        })

        await connection.save();

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connections: connection.sender._id }
        })

        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: { connections: req.userId }
        })

        let recieverSocketId = userSocketMap.get(connection.reciever._id.toString());
        let senderSocketId = userSocketMap.get(connection.sender._id.toString());

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: connection.sender._id, newStatus: "disconnect" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: req.userId, newStatus: "disconnect" })
        }

        return res.status(200).json({ message: "connection accepted" })

    } catch (error) {
        return res.status(500).json({ message: `accept connection error ${error}` })
    }
}

export const rejectConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;
        let connection = await Connection.findById(connectionId)
        if (!connection) {
            return res.status(500).json({ message: 'connection does not exist' })
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }

        connection.status = "rejected"
        await connection.save();



        return res.status(200).json({ message: "connection rejected" })
    } catch (error) {
        return res.status(500).json({ message: `accept connection error ${error}` })
    }
}

export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId
        const currentUserId = req.userId;
        let currUser = await User.findById(currentUserId);
        if (currUser.connections.includes(targetUserId)) {
            return res.json({ status: "disconnect" })
        }

        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, reciever: targetUserId },
                { sender: targetUserId, reciever: currentUserId },
            ],
            status: "pending"
        })

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ status: "pending" })
            } else {
                return res.json({ status: "recieved", requestId: pendingRequest._id })
            }
        }

        //if no connection or pending request found
        return res.json({ status: "connect" })
    } catch (error) {
        return res.status(500).json({ message: "get connection status error" })
    }
}

// export const removeConnection = async (req, res) => {
//     try {
//         const myid = req.userId;
//         const otherUserId = req.params.userId;

//         await User.findByIdAndUpdate(myid, {
//             $pull: { connections: otherUserId }
//         });

//         await User.findByIdAndUpdate(otherUserId, {
//             $pull: { connections: myid }
//         });

//         let recieverSocketId = userSocketMap.get(otherUserId);
//         let senderSocketId = userSocketMap.get(myid)

//         if (recieverSocketId) {
//             io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: myid, newStatus: "connect" })
//         }

//         if (senderSocketId) {
//             io.to(senderSocketId).emit("statusUpdate", { updatedUserId: otherUserId, newStatus: "connect" })
//         }

//         return res.json({ message: "Connection removed successfully" })
//     } catch (error) {
//         return res.json({ message: "remove connetion errror" })

//     }
// }

export const removeConnection = async (req, res) => {
    try {
        const myid = req.userId;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myid, {
            $pull: { connections: otherUserId }
        });

        await User.findByIdAndUpdate(otherUserId, {
            $pull: { connections: myid }
        });

        const recieverSocketId = userSocketMap.get(otherUserId);
        const senderSocketId = userSocketMap.get(myid);

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: myid, newStatus: "connect" });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: otherUserId, newStatus: "connect" });
        }

        return res.json({ message: "Connection removed successfully" });
    } catch (error) {
        return res.json({ message: "remove connection error" });
    }
}


export const getConnectionsRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await Connection.find({ reciever: userId, status: "pending" })
            .populate("sender", "firstName lastName email userName profileImage headline")

        return res.json(requests)
    } catch (error) {
        res.status(500).json({ message: "get all connection requests error" })

    }
}

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate(
            "connections", "firstName lastName  userName profileImage headline connections"
        )

        return res.status(200).json(user.connections)
    } catch (error) {
        res.status(500).json({ message: "get user connections error" })
    }
}