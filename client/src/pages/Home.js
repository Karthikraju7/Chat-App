import React, { useContext, useState } from 'react'
import Chat from '../components/Chat'
import Side from '../components/Side'
import { ChatContext } from '../context/ChatContext'

const Home = () => {

  const {selectedUser} = useContext(ChatContext)
  
  return (
    <div className='w-full h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 sm:px-[8%] sm:py-[4%] p-4'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className='relative z-10 h-full max-w-[1600px] mx-auto'>
        <div className={`h-full rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm
          border border-slate-700/50 bg-slate-900/50 
          grid ${selectedUser ? 'grid-cols-[350px_1fr] max-md:grid-cols-1' : 'grid-cols-[350px_1fr] max-md:grid-cols-1'}`}>
          <Side />
          <Chat />
        </div>
      </div>
    </div>
  )
}

export default Home