import React, { useContext, useEffect, useRef, useState} from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { convertTime } from '../lib/utils'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

const Chat = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
  const {authUser, onlineUsers } = useContext(AuthContext)

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if(input.trim() === '') return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }
  const scrollEnd = useRef()
  const [input, setInput] = useState('');
  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(()=>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])
  return selectedUser ?(
    <div className='h-full overflow-hidden relative backdrop-blur-lg'>
      {/* This is head section */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500 '>
        <img src={assets.avatar_icon} alt='profile' className='w-8 rounded-full'/>
        <p className='text-white'>{selectedUser.fullName}</p>  
      </div>
      {/* This is chat section */}
      <div className='flex flex-col overflow-y-scroll p-3 pb-6 h-[calc(100%-120px)]'>
         {messages.map((msg)=>(
          msg.text && (<div key={msg._id} className={`flex items-end gap-2 justify-end 
          ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}> 
          <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all text-white bg-violet-400
            ${msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"}`}>{msg.text}</p>
            <div className='text-center text-xs'>
              <img src={assets.avatar_icon} alt='avatar' className='w-7 rounded-full' />
              <p className='text-gray-500'>
                {convertTime(msg.createdAt)}
              </p>
              </div>
          </div>
          )
         ))}
         <div ref={scrollEnd}> 
         </div>
      </div>
      {/* Send message */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-500/20 px-3 rounded-full'>
          <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null } 
          type="text" placeholder='Send Message' 
          className='flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400' />
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="Send" className='w-7 mr-6 cursor-pointer'/>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 max-md:hidden'>
       <img src={assets.logo_chat} alt='logo' className='max-w-16' />
       <p className='text-lg font-medium text-white'>Talk to Someone Bro</p>
    </div>
  )
}
export default Chat