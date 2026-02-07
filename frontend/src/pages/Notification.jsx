import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { RxCross1 } from "react-icons/rx";
import { authDataContext } from '../context/AuthContext'
import dp from '../assets/dp.webp'
import axios from 'axios'

const Notification = () => {
    const { serverUrl } = useContext(authDataContext)

    const [notificationData, setNotificationData] = useState([]);

    const handleGetNotificationData = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/notification/get", { withCredentials: true })
            setNotificationData(result.data);
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handledeleteNotification = async (id) => {
        try {
            const result = await axios.delete(serverUrl + `/api/notification/deleteOne/${id}`, { withCredentials: true })
            await handleGetNotificationData();
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClearNotification = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/notification/", { withCredentials: true })
            await handleGetNotificationData();
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleMessage = (type) => {
        if (type == "like") {
            return "liked your post"
        }
        else if (type == "comment") {
            return "commented your post"
        }
        else {
            return "Accept your connection"
        }
    }


    useEffect(() => {
        handleGetNotificationData();
    }, []);



    return (
        <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
            <Navbar />

            <div className='w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center justify-between p-[10px] text-[22px] text-gray-600'>
                <div>
                    Notifications {notificationData.length}
                </div>

                {notificationData.length > 0 && <button className='min-w-[100px ] h-[40px] rounded-full p-[5px] border-2 border-[#ec4545] cursor-pointer' onClick={handleClearNotification}>Clear all</button>}

            </div>

            {notificationData.length > 0 && (
                <div className='w-[100%] max-w-[900px] bg-white shadow-lg rounded-lg flex flex-col gap-[20px] max-h-[100vh] overflow-auto p-[20px]'>
                    {notificationData.map((noti, index) => (
                        <div key={noti._id} className='w-full min-h-[100px] p-[20px] flex justify-between items-center border-b-2 border-b-gray-200'>
                            <div>
                                <div className='flex justify-center items-center gap-[10px]'>
                                    <div className='w-[60px] h-[60px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer'>
                                        <img src={noti.relatedUser.profileImage || dp} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <div className='text-[19px] font-semibold text-gray-700'>
                                        {`${noti.relatedUser.firstName} ${noti.relatedUser.lastName} ${handleMessage(noti.type)}`}
                                    </div>



                                </div>

                                {noti.relatedPost && <div className='flex items-center gap-[10px] ml-[80px]  h-[70px]'>
                                    <div className='w-[80px] h-[50px] overflow-hidden'>
                                        <img src={noti.relatedPost.image} alt="" className='h-full' />
                                    </div>
                                    <div>
                                        {noti.relatedPost.description}
                                    </div>
                                </div>}

                            </div>

                            <div className='flex justify-center items-center gap-[10px] cursor-pointer' onClick={() => handledeleteNotification(noti._id)}>
                                <RxCross1 className='w-[25px] h-[25px] text-gray-700 font-semibold' />
                            </div>


                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Notification
