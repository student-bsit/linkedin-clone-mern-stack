import React, { useContext, useEffect, useState } from 'react'
import logo2 from '../assets/pngwing.com.png'
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import dp from '../assets/dp.webp'
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [activeSearch, setActiveSearch] = useState(false);
    const [showPopup, setShowPopup] = useState(false)
    const { userData, setUserData, handleGetProfile } = useContext(userDataContext)

    const { serverUrl } = useContext(authDataContext)
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState([]);

    const handleSignOut = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })

            localStorage.removeItem("userData"); // ✅ Clear cache
            navigate("/login")
            setUserData(null)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${search}`, { withCredentials: true })
            setSearchData(result.data)
            console.log(result.data);
        } catch (error) {
            setSearchData([]);
            console.log(error)

        }
    }

    useEffect(() => {
        if (search.trim() === "") {
            setSearchData([]);
            return;
        }
        handleSearch();
    }, [search]);



    return (
        <div className='w-full h-[80px] bg-white fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>


            <div className='flex justify-center items-center gap-[10px] cursor-pointer'>
                <div onClick={() => {
                    setActiveSearch(false)
                    navigate("/");
                }}>
                    <img src={logo2} alt="" className='w-[50px] ' />
                </div>

                {!activeSearch && <div><IoSearchSharp className='w-[23px] h-[23px]    text-gray-600 lg:hidden' onClick={() => setActiveSearch(true)} /></div>}

                {search.trim() !== "" && searchData.length > 0 && <div className='absolute top-[90px] min-h-[100px] left-[0px] lg:left-[20px] shadow-lg w-[100%] lg:w-[700px] bg-white flex flex-col gap-[20px] p-[20px] '>


                    <div className="max-h-[500px] overflow-y-auto">
                        {searchData.map((sea) => (
                            <div
                                key={sea._id}
                                className="flex gap-[20px] items-center border-b border-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer rounded-lg"
                                onClick={() => handleGetProfile(sea.userName)}
                            >
                                <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                                    <img src={sea.profileImage || dp} alt="" />
                                </div>

                                <div>
                                    <div className="text-[19px] font-semibold">
                                        {sea.firstName} {sea.lastName}
                                    </div>
                                    <div className="text-[15px] text-gray-600">
                                        {sea.headline}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>}


                <form className={`lg:flex w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7]  items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch ? "hidden" : "flex"} `}>
                    <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600' /></div>
                    <input type="text" className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search users...' value={search} onChange={(e) => setSearch(e.target.value)} />
                </form>
            </div>

            <div className='flex justify-center items- gap-[20px] '>

                {showPopup && <div className=' w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[70px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px]'>

                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                        <img src={userData.profileImage || dp} alt="" />
                    </div>

                    <div className='text-[19px] font-semibold ' >
                        {userData ? (
                            <h1>{userData.firstName} {userData.lastName}</h1>
                        ) : (
                            <p>Loading user...</p>
                        )}
                    </div>

                    <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff]' onClick={() => handleGetProfile(userData.userName)}>View profile</button>

                    <div className='w-full h-[1px] opacity-35 bg-gray-600'></div>

                    <div
                        className="w-full flex justify-start items-center text-gray-600 gap-[10px] cursor-pointer"
                        onClick={() => navigate("/network")}
                    >
                        <FaUserGroup className="w-[23px] h-[23px] text-gray-600" />
                        <div>My Network</div>
                    </div>


                    <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] cursor-pointer' onClick={handleSignOut}>Sign Out</button>


                </div>}

                <div className='lg:flex  flex-col justify-center items-center text-gray-600 hidden cursor-pointer' onClick={() => navigate("/")}>
                    <TiHome className='w-[23px] h-[23px] text-gray-600' />
                    <div>Home</div>
                </div>

                <div className='md:flex   flex-col justify-center items-center text-gray-600 hidden' onClick={() => navigate("/network")}>
                    <FaUserGroup className='w-[23px] h-[23px] text-gray-600' />
                    <div>My Network</div>
                </div>

                <div className='flex flex-col justify-center items-center text-gray-600 cursor-pointer' onClick={() => navigate("/notification")}>
                    <IoNotificationsSharp className='w-[23px] h-[23px] text-gray-600' />
                    <div className='hidden md:block'>Notifications</div>
                </div>

                <div>
                    <div className='w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer' onClick={() => setShowPopup(prev => !prev)}>
                        <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Navbar
