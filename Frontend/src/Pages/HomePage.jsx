import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore';

const HomePage = () => {

  const {user, isAuthenticated} = useAuthStore()
  // console.log(user, isAuthenticated);

  const navigate = useNavigate();

  const handleVisit = ()=>{

    navigate("/signup");

  }

  return(
    <>

      <button onClick={handleVisit} className='bg-emerald-500 p-2 rounded-lg text-white text-2xl font-bold hover:scale-125 transition-transform duration-300'>Visit Our Website</button>
      
    </>
  )
}

export default HomePage
