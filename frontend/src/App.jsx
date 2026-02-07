import { useContext, useEffect } from "react";
import { socket,userDataContext } from "./context/UserContext";
import { Route, Routes, Navigate } from "react-router-dom"; // ✅ use Navigate (component) not useNavigate()
import Signup from '../src/pages/Signup';
import Login from '../src/pages/Login';
import Home from '../src/pages/Home'
import NetworkPage from '../src/components/NetworkPage';

import Profile from "./pages/Profile";
import Notification from "./pages/Notification";




const App = () => {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return <div className='text-center text-xl mt-[100px]'>Loading...</div>;
  }

  useEffect(() => {
  if (userData?._id) {
    socket.emit("register", userData._id);
  }
}, [userData]);



   
  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path='/signup' element={userData ? <Navigate to="/" /> : <Signup />} />
      <Route path='/login' element={userData ? <Navigate to="/" /> : <Login />} />
      <Route path='/network' element={userData ? <NetworkPage /> : <Navigate to="/login" />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
      <Route path='/notification' element={userData ? <Notification /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
