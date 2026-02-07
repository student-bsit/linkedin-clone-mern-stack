import { React, useContext, useState, useEffect } from 'react'
import dp from '../assets/dp.webp'
import axios from 'axios';
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { authDataContext } from '../context/AuthContext';
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import moment from 'moment'
import { socket, userDataContext } from '../context/UserContext';
import { MdFormatClear } from 'react-icons/md';

import ConnectionButon from './ConnectionButon';



const Post = ({ id, author, like, comment, description, image, createdAt }) => {
  const { serverUrl } = useContext(authDataContext)
  const { userData, setUserData, getPost,handleGetProfile } = useContext(userDataContext)


  const [more, setMore] = useState(false);
  const [close, setClose] = useState(false);
  const [likes, setlikes] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [Comment, setComment] = useState([])

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true });
      setlikes(result.data.like)
      console.log(result.data);


    } catch (error) {
      console.log(error)
    }
  }


  const handlecomment = async (e) => {
    e.preventDefault()
    try {
      let result = await axios.post(serverUrl + `/api/post/comment/${id}`, {
        content: commentContent
      }, { withCredentials: true });
      setComment(result.data.comment)
      console.log(result.data);
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(()=>{
    socket.on("likeUpdated",({postId,likes})=>{
      if(postId===id){
        setlikes(likes)
      }
    })

    socket.on("commentAdded",({postId,comm})=>{
      if(postId===id){
        setComment(comm)
      }
    })

    return ()=>{
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }

  },[id])


  useEffect(()=>{
    setlikes(like);
    setComment(comment)
  },[like,comment])


  return (
    <div className='w-full min-h-[200px] bg-white flex flex-col gap-[10px] rounded-lg shadow-lg p-[20px]'>

      <div className='flex justify-between items-center'>

        <div className='flex justify-center items-start gap-[10px]'onClick={()=>handleGetProfile(author.userName)}>

          <div className='w-[70px] h-[70px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer '>
            <img src={author.profileImage || dp} alt="" className='w-full h-full' />
          </div>

          <div>
            <div className='text-[22px] font-semibold'>{`${author.firstName} ${author.lastName}`}</div>
            <div className='text-[16px]'>{author.headline}</div>
            <div className='text-[16px]'>{moment(createdAt).fromNow()}</div>
          </div>

        </div>

        <div>
          {userData._id!=author._id && <ConnectionButon userId={author._id}/>}
        </div>

      </div>

      <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} pl-[50px]`}>{description}</div>

      <div className='pl-[50px] text-[19px] font-semibold cursor-pointer' onClick={() => setMore(prev => !prev)}>{more ? "read less..." : "read more..."}</div>

      {image && <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg'>
        <img src={image} alt="" className='h-full w-full rounded-lg' />
      </div>}

      <div>

        <div className='w-full flex justify-between items-center p-[20px] border-b-2'>

          <div className='flex items-center justify-center gap-[5px] text-[18px]'>
            <AiOutlineLike className='text-[#1ebbff] w-[20px] h-[20px] ' /><span>{likes.length}</span>
          </div>

          <div className='flex items-center justify-center gap-[5px] text-[18px]'>
            <span>{comment.length}</span><span>comments</span>
          </div>

        </div>

        <div className='flex justify-start items-center w-full p-[20px] gap-[20px]'>
          {!likes.includes(userData._id) && <div className='flex justify-center items-center gap-[5px] cursor-pointer ' onClick={handleLike}>
            <AiOutlineLike className='w-[24px] h-[24px]' />
            <span>Like</span>
          </div>}

          {likes.includes(userData._id) && <div className='flex justify-center items-center cursor-pointer gap-[5px]' onClick={handleLike}>
            <BiSolidLike className='w-[24px] h-[24px] text-[#07a4ff]' />
            <span className='text-[#07a4ff] font-semibold'>Liked</span>
          </div>}


          <div className='flex justify-center items-center cursor-pointer gap-[5px]' onClick={() => setClose(prev => !prev)}>
            <FaRegCommentDots />
            <span>comment</span>
          </div>
        </div>

        {close && <div>
          <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]' onSubmit={handlecomment} >
            <input type="text" placeholder='leave a comment' className='
            outline-none border-b-gray-500 border-none' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
            <button ><LuSendHorizontal className='text-[#07a4ff] w-[22px] h-[22px]' /></button>
          </form>

          <div className="flex flex-col mt-3 gap-y-4">
            {Comment.map((comm) => (
              <div key={comm._id} className='flex flex-col gap-[10px] border-b-2 border-b-gray-300 pb-2'>
                <div className='w-full flex gap-[10px] justify-start items-center'>
                  <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer '>
                    <img src={comm.user.profileImage || dp} alt="" className='w-full h-full' />
                  </div>
                  <div>
                    <div className='text-[22px] font-semibold'>{`${comm.user.firstName} ${comm.user.lastName}`}</div>
                    <div>{moment(createdAt).fromNow()}</div>
                  </div>
                </div>
                <div className='pl-[50px] '>{comm.content}</div>
              </div>
            ))}
          </div>


        </div>}


      </div>
    </div>

  )
}

export default Post
