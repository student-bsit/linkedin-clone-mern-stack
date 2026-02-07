import React from 'react'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { GrStatusGood } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import dp from '../assets/dp.webp'

const NetworkPage = () => {
  const { serverUrl } = useContext(authDataContext)
  const [connections, setConnections] = useState([]);

  const handleGetRequests = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/ConnRequests`, { withCredentials: true })
      setConnections(result.data);
      console.log(result);
    } catch (error) {
      console.log(error)
    }

  }

  const handleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/accept/${requestId}`, { withCredentials: true })
      console.log(result)
      setConnections(connections.filter((con) => con._id !== requestId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectConnection = async (requestId) => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/reject/${requestId}`, {}, { withCredentials: true })
      console.log(result)
      setConnections(connections.filter((con) => con._id !== requestId))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetRequests();
  }, [])

  return (
    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>

      <Navbar />

      <div className='w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600'>
        Invitations {connections.length}

      </div>

      {connections.length > 0 && (
        <div className='w-[100%] max-w-[900px] bg-white shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px]'>
          {connections.map((conn, index) => (
            <div key={conn._id} className='w-full min-h-[100px] p-[20px] flex justify-between items-center'>
              <div className='flex justify-center items-center gap-[10px]'>
                <div className='w-[60px] h-[60px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer'>
                  <img src={conn.sender.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className='text-[19px] font-semibold text-gray-700'>
                  {`${conn.sender.firstName} ${conn.sender.lastName}`}
                </div>
              </div>

              <div className='flex gap-[10px]'>
                <button className='text-[#18c5ff] font-semibold' onClick={() => handleAcceptConnection(conn._id)}>
                  <GrStatusGood  className='w-[40px] h-[40px]' />
                </button>
                <button className='text-[#ff4218] font-semibold' onClick={() => handleRejectConnection(conn._id)}>
                  <RxCross2  className='w-[36px] h-[36px]' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}



    </div>
  )
}

export default NetworkPage
