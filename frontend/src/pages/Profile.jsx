import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import dp from '../assets/dp.webp'
import { FaPlus } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import { userDataContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';
import ConnectionButon from '../components/ConnectionButon';

const Profile = () => {

    const { userData, setUserData, edit, setEdit, getPostData, setPostData, profileData, setProfileData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)

    const [profilePost, setProfilePost] = useState([]);



    

    useEffect(() => {
        setProfilePost(getPostData.filter((post) => post.author._id == profileData._id))
    }, [profileData])

    return (
        <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pb-[80px] '>

            <Navbar />
            {edit && <EditProfile />}

            <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] '>

                <div className='relative bg-white pt-[20px] rounded shadow-lg mt-[70px]' >
                    <div className='w-[100%] h-[100px] bg-gray-400 rounded relative flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
                        <img src={profileData.coverImage || ""} alt="" className='h-full w-full' />
                        <MdOutlineCameraAlt className='absolute top-[10px] right-[10px] text-white text-[25px] cursor-pointer' />
                    </div>

                    <div className='w-[70px] h-[70px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer absolute top-[57px] left-[35px]' onClick={() => setEdit(true)}>
                        <img src={profileData.profileImage || dp} alt="" className='w-full h-full' />
                    </div>

                    <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[90px] left-[90px] rounded-full flex justify-center items-center'>
                        <FaPlus className='text-white' />
                    </div>

                    <div className='mt-[30px] pl-[20px]  font-semibold text-gray-700'>
                        <div className='text-[24px] font-bold'>{userData ? `${profileData.firstName} ${profileData.lastName}` : 'Loading...'}</div>

                        <div className='text-[18px] text-gray-500'>{userData ? `${profileData.headline}` : ""}</div>

                        <div className='text-[16px] text-gray-500'>{userData ? `${profileData.location}` : 'Pakistan'}</div>

                        <div className='text-[16px] text-gray-500'>{`${profileData.connections.length} connections`}</div>

                    </div>

                    {profileData._id == userData._id && <button className='min-w-[150px] h-[40px] my-[20px] flex justify-center items-center gap-[10px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] ml-[20px]' onClick={() => setEdit(true)}>Edit Profile<HiPencil /></button>}

                    {profileData._id !== userData._id && <div className='ml-[20px] mt-[20px]'><ConnectionButon userId={profileData._id} /></div>}

                </div>

                <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg'>
                    {`Post (${profilePost.length})`}
                </div>

                {profilePost.map((post, index) => (
                    <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
                ))}

                {profileData.skills.length > 0 && <div className='w-full min-h-[100px] flex justify-center flex-col gap-[10px] p-[20px]  bg-white shadow-lg'><div className='text-[22px] text-gray-600' >
                    Skills
                </div>
                    <div className='flex flex-wrap justify-start items-center gap-[20px] text-gray-600 p-[20px]'>
                        {userData.skills.map((skill) => (
                            <div className='text-[20px]'>{skill}</div>
                        ))}
                        {profileData._id==userData._id && <button className='min-w-[150px] h-[40px]  flex justify-center items-center gap-[10px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] ml-[20px]' onClick={() => setEdit(true)}>Add Skills</button>}
                    </div>
                </div>}

                {profileData.education.length > 0 && <div className='w-full min-h-[100px] flex justify-center flex-col gap-[10px] p-[20px]  bg-white shadow-lg'><div className='text-[22px] text-gray-600' >
                    Education
                </div>
                    <div className='flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px]'>
                        {profileData.education.map((edu) => (
                            <>
                                <div className='text-[20px]'>College :{edu.college}</div>
                                <div className='text-[20px]'>Degree :{edu.degree}</div>
                                <div className='text-[20px]'>Field of Study :{edu.fieldOfstudy}</div>
                            </>
                        ))}
                        {profileData._id==userData._id && <button className='min-w-[150px] h-[40px]  flex justify-center items-center gap-[10px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] ' onClick={() => setEdit(true)}>Add Education</button>}
                        
                    </div>
                </div>}

                {profileData.experience.length > 0 && <div className='w-full min-h-[100px] flex justify-center flex-col gap-[10px] p-[20px]  bg-white shadow-lg'><div className='text-[22px] text-gray-600' >
                    Experience
                </div>
                    <div className='flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px]'>
                        {profileData.experience.map((exp) => (
                            <>
                                <div className='text-[20px]'>Title : {exp.title}</div>
                                <div className='text-[20px]'>Company : {exp.company}</div>
                                <div className='text-[20px]'>Description : {exp.description}</div>
                            </>
                        ))}
                        {profileData._id==userData._id && <button className='min-w-[150px] h-[40px]  flex justify-center items-center gap-[10px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] ' onClick={() => setEdit(true)}>Add Experience</button>}
                        
                    </div>
                </div>}

            </div>

        </div>
    )
}

export default Profile
