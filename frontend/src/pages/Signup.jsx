import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext';
import axios from 'axios'
import { userDataContext } from '../context/UserContext';

const Signup = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        firstName,
        lastName,
        userName,
        email,
        password
      }, { withCredentials: true })

      console.log(result)
      setErr("")
      setFirstName("");
      setLastName("");
      setUserName("");
      setPassword("");
      setEmail("");
      setPassword("")
      setLoading(false)

      setUserData(result.data.newUser)

      navigate("/");
    } catch (error) {
      console.log(error)
      setUserData(null);
      setErr(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start'>
      <div className='p-[30px] lg:p-[35px] w-full flex items-center'>
        <img src={logo} alt="Logo" className='w-[130px]' />
      </div>

      <form
        onSubmit={handleSignup}
        className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center p-[15px] gap-[10px]'
      >
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign Up</h1>

        <input type="text" placeholder='First Name' required
          className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'
          value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <input type="text" placeholder='Last Name' required
          className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'
          value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <input type="text" placeholder='User Name' required
          className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'
          value={userName} onChange={(e) => setUserName(e.target.value)} />

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

        <button className='w-full h-[50px] rounded-full bg-[#1dc9fd] mt-[40px] text-white' disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>

        <p className='text-center cursor-pointer' onClick={() => navigate("/login")}>
          Already have an account? <span className='text-[#2a9bd8]'>Sign In</span>
        </p>
      </form>
    </div>
  )
}

export default Signup
