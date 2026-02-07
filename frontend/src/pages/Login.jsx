
import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext';

import axios from 'axios'
import { userDataContext } from '../context/UserContext';

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext)


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // const handleSignIn = async (e) => {
  //   e.preventDefault()
  //   setLoading(true);
  //   try {
  //     const result = await axios.post(`${serverUrl}/api/auth/login`, {
  //       email,
  //       password
  //     }, { withCredentials: true })

  //     console.log(result)
  //     setUserData(result.data)
  //     localStorage.setItem("userData", JSON.stringify(result.data));

  //     setErr("")
  //     setPassword("");
  //     setEmail("");
  //     setPassword("")
  //     setLoading(false)

  //     navigate("/")


  //   } catch (error) {
  //     console.log(error)
  //     setErr(error.response.data.message)
  //     setLoading(false)
  //   }
  // }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password
      }, { withCredentials: true });

      console.log(result);

      // ✅ Set user data in context
      setUserData(result.data.user);


      // ✅ Save to localStorage
      // localStorage.setItem("userData", JSON.stringify(result.data));

      // ✅ Clear form fields
      setEmail("");
      setPassword("");

      setErr("");
      setLoading(false);

      // ✅ Navigate after small delay to ensure context updates
      // setTimeout(() => {
      //   navigate("/");
      // }, 0);

    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };


  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start'>
      <div className='p-[30px] lg:p-[35px] w-full flex items-center'>
        <img src={logo} alt="Logo" className='w-[130px]' />
      </div>

      <form
        onSubmit={handleSignIn}
        className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center p-[15px] gap-[10px]'
      >
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Log In</h1>



        <input type="email" placeholder='Email' required
          className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            required
            autoComplete="new-password"  // ✅ Prevent browser autofill
            className="w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className='absolute right-[20px] top-[10px] cursor-pointer text-[#24b2ff] font-semibold'
            onClick={() => setShow(prev => !prev)}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        {err && <p className='text-center text-red-500'>*{err}</p>}

        <button className='w-full h-[50px] rounded-full bg-[#1dc9fd] mt-[40px] text-white' disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>

        <p className='text-center cursor-pointer' onClick={() => navigate("/signup")}>
          want to create a new account ? <span className='text-[#2a9bd8]'>Sign Up</span>
        </p>
      </form>
    </div>
  )

}

export default Login
