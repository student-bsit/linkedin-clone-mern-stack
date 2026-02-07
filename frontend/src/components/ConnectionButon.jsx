import React from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import io from 'socket.io-client'
import { useState } from 'react'
import { useEffect } from 'react'
import { socket, userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'



const ConnectionButon = ({ userId }) => {

    const { serverUrl } = useContext(authDataContext)
    const { userData } = useContext(userDataContext)
    const [status, setStatus] = useState("")
    const navigate = useNavigate();


    const handleSendConnection = async () => {
        try {
            let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, { withCredentials: true })
            console.log(result)
        } catch (error) {
            console.log("Error:", error?.response?.data || error.message);
        }

    }

    const handleRemoveConnection = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection/removeConnection/${userId}`, { withCredentials: true })
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    const getStatus = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection/getStatus/${userId}`, { withCredentials: true })
            setStatus(result.data.status)
            console.log("get status ma ma hon ", result.data.status)
        } catch (error) {
            console.log(error)
        }
    }


    const handleClick = async () => {

        if (status === "disconnect") {
            await handleRemoveConnection();
        } else if (status === "recieved") {
            navigate("/network")
        } else {
            await handleSendConnection();
        }
    }


    useEffect(() => {
        // socket.emit("register", userData._id)
        getStatus();

        socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
            if (updatedUserId == userId) {
                setStatus(newStatus)
            }
        })

        return () => {
            socket.off("statusUpdate")
        }

    }, [userId])

    return (

        <button className='min-w-[100px] h-[40px] my-[20px]  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' disabled={status == "pending"} onClick={handleClick}>{status}</button>

    )
}

export default ConnectionButon
