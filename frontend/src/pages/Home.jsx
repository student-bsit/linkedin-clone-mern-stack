import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import dp from '../assets/dp.webp'
import { FaPlus } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import { userDataContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';
import { BsImage } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { useSearchParams } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post'
import axios from 'axios';

const Home = () => {
  let { edit, setEdit, userData, setUserData, getPostData, setPostData, handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext)

  let [posting, setPosting] = useState(false)

  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [description, setDiscription] = useState("")
  const image = useRef();
  const [uploadpost, setUploadPost] = useState(false)
  const [suggUsers, setSuggUsers] = useState([]);

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));

  }

  async function handleUploadPost() {
    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage)
      }
      let result = await axios.post(serverUrl + "/api/post/create", formdata, { withCredentials: true })

      console.log(result)
      setPostData(prev => [result.data, ...prev]);
      setPosting(false)
      setUploadPost(false)
      setDiscription("");
    } catch (error) {
      setUploadPost(false)
      setPosting(false)
      console.log(error)


    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/sugestedUser", { withCredentials: true })
      setSuggUsers(result.data);
      console.log(result.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSuggestedUsers();
  }, [])


  return (
    <div className='w-full min-h-[100vh] pb-[50px]  bg-[#f0efe7] pt-[100px] flex items-center lg:items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row'  >
      {edit && <EditProfile />}
      <Navbar />

      <div className=' w-full lg:w-[25%] min-h-[200px] px-[10px] py-[10px] bg-white shadow-lg rounded-lg relative'>

        <div className='w-[100%] h-[100px] bg-gray-400 rounded relative flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.coverImage || ""} alt="" className='h-full w-full' />
          <MdOutlineCameraAlt className='absolute top-[10px] right-[10px] text-white text-[25px] cursor-pointer' />
        </div>

        <div className='w-[70px] h-[70px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer absolute top-[57px] left-[35px]' onClick={() => setEdit(true)}>
          <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
        </div>

        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[90px] left-[90px] rounded-full flex justify-center items-center'>
          <FaPlus className='text-white' />
        </div>

        <div className='mt-[30px] pl-[20px]  font-semibold text-gray-700'>
          <div className='text-[22px]'>{userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}</div>

          <div className='text-[18px] text-gray-500'>{userData ? `${userData.headline}` : ""}</div>

          <div className='text-[16px] text-gray-500'>{userData ? `${userData.location}` : 'Pakistan'}</div>

        </div>

        <button className='w-[100%] h-[40px] my-[20px] flex justify-center items-center gap-[10px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={() => setEdit(true)}>Edit Profile<HiPencil /></button>

      </div>

      {uploadpost && <div className='w-full h-full bg-black fixed top-0 z-[100] left-0 opacity-[0.6]'>

      </div>}

      {uploadpost && <div className='w-[90%] max-w-[500px]  h-[600px] bg-white shadow-lg rounded-lg fixed z-[200] p-[20px] top-[100px] flex flex-col items-start justify-start gap-[20px]'>

        <div className='absolute top-[20px] right-[20px]  cursor-pointer'>
          <RxCross1 className='w-[25px] h-[25px] text-gray-700 font-semibold' onClick={() => setUploadPost(false)} />
        </div>

        <div className='flex justify-start items- gap-[10px]'>

          <div className='w-[70px] h-[70px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer '>
            <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
          </div>
          <div className='mt-[30px] pl-[20px]  font-semibold text-gray-700'>
            <div className='text-[22px]'>{userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}</div>
          </div>

        </div>

        <textarea className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"} outline-none border-none p[10px] resize-none text-[19px] `} placeholder='what do you want to talk about..?' value={description} onChange={(e) => setDiscription(e.target.value)}></textarea>

        <input type="file" ref={image} hidden onChange={handleImage} />

        <div className='w-full h-[300px] overflow-hidden flex justify-center items-center'>
          <img src={frontendImage || ""} alt="" className='h-full' />
        </div>

        <div className='w-full h-[200px] flex flex-col'>
          <div className='p-[20px] flex items-center justify-start border-b-2 border-gray-500 cursor-pointer'>
            <BsImage className='w-[24px] h-[24px] text-gray-500' onClick={() => image.current.click()} />
          </div>



          <div className='flex justify-end items-center'>
            <button className='w-[100px] h-[50px] rounded-full bg-[#1dc9fd] mt-[40px] text-white' disabled={posting} onClick={handleUploadPost}>{posting ? "Posting" : "Post"}</button>
          </div>
        </div>

      </div>}



      <div className='w-full lg:w-[50%] min-h-[200px] flex flex-col gap-[20px] bg-[#f0efe7] '>

        <div className='w-full h-[120px] bg-white shadow-lg rounded-lg flex justify-center items-center gap-[10px] p-[20px] '>

          <div className='w-[70px] h-[70px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer ' >
            <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
          </div>

          <button className='w-[80%] h-[60px] border-2 rounded-full flex justify-start items-center px-[20px] hover:bg-gray-200 border-gray-500' onClick={() => setUploadPost(true)}>start a post</button>
        </div>

        {getPostData.map((post, index) => (
          <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
        ))}

      </div>

      <div className='w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>

        {suggUsers.length > 0 && <div className='flex flex-col gap-[10px]'>
          {suggUsers.map((sugg) => (
            <div className='flex items-center gap-[10px] mt-[10px] cursor-pointer rounded-lg hover:bg-gray-200 p-[5px]' onClick={() => handleGetProfile(sugg.userName)}>
              <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
                <img src={sugg.profileImage || dp} alt="" />
              </div>

              <div>
                <div className='text-[19px] font-semibold '>
                  {`${sugg.firstName} ${sugg.lastName}`}
                </div>
                <div className='text-[12px] font-semibold '>
                  {sugg.headline}
                </div>
              </div>
            </div>
          ))}
        </div>}

        {suggUsers.length == 0 && <div>
          <h1>No Suggested Users</h1>
        </div>}





      </div>


    </div>
  )
}

export default Home
