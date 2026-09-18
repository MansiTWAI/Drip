import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import { useState } from 'react';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';
export const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? "" : "http://localhost:4000")
export const currency='₹'
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(token));

  useEffect(()=>{
    localStorage.setItem('token', token)
  },[token])

  useEffect(() => {
    if (!token) {
      setIsCheckingSession(false);
      return;
    }

    let active = true;
    axios.get(`${backendUrl}/api/user/admin/verify`, { headers: { token } })
      .then(() => active && setIsCheckingSession(false))
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('token');
        setToken('');
        setIsCheckingSession(false);
      });

    return () => { active = false; };
  }, [token]);

  if (isCheckingSession) {
    return <div className='min-h-screen grid place-items-center bg-[#FCFBF9] text-stone-500'>Checking admin session…</div>;
  }
  return (
    <div className='bg-gryay-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base '>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                 <Route path='/' element={<List token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App
