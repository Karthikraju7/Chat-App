import React, { useContext, useState } from 'react'
import Chat from '../components/Chat'
import Side from '../components/Side'
import { ChatContext } from '../context/ChatContext'

const Home = () => {

  const {selectedUser} = useContext(ChatContext)
  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`border-2 border-black rounded-2xl overflow-hidden 
      grid h-full relative gap-12 ${selectedUser ? 'grid-cols-[1fr_1.5fr]' : 'grid-cols-[1fr_1fr]'}`}>
        <Side />
        <Chat />
      </div>  
    </div>
  )
}

export default Home