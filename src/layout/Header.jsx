import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


import Logo from "../assets/svg/logo-green.svg" 



const Header = () => {
  
  const navigate = useNavigate()

  return (
    <div 
      className='bg-[#000] fixed z-50 w-full pl-[32px] h-[80px] pr-[127px] py-5 flex items-center justify-between'
    >
      <img src={Logo} alt="Logo" className='w-auto h-[44px] cursor-pointer' onClick={() => {window.open("https://www.fractnmoney.com", "_blank"); window.scrollTo(0, 0)}}/>       
    </div>
  )
}

export default Header