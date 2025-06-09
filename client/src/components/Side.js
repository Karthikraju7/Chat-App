import React, { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Side = () => {

  const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);

  const {logout, onlineUsers} = useContext(AuthContext)

  const [input, setInput] = useState(false)

  const filteredUsers = input ? users.filter((user)=> user.fullName.toLowerCase().includes(input.toLowerCase())): users;

  useEffect(()=>{
    getUsers();
  },[onlineUsers])

//   useEffect(() => {
//   console.log("Users Fetched:", users);
// }, [users]);


  return (
    <div className={`h-full p-5 text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo_chat} alt='logo' className='max-w-12' />
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt='menu_icon' className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 p-5 w-32 z-20 border rounded-md border-gray-600 text-gray-100 hidden group-hover:block bg-black'>
              <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>
        <div className='flex bg-slate-500 rounded-full items-center gap-5 mt-4 px-4 py-5'>
          <img src={assets.search_icon} alt="search" className='w-3'/>
          <input onChange={(e)=>setInput(e.target.value)} type='text' placeholder='Search Mate' className='border-none outline-none bg-transparent text-white flex-1 h-4'/>
        </div>     
      </div>

      <div className='flex flex-col'>
        {filteredUsers.map((userItem) => (        
          <div onClick={()=> {setSelectedUser(userItem); setUnseenMessages(prev=>({
            ...prev , [userItem._id]:0
          }))}}
            key={userItem._id}
            className={`flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm 
            ${selectedUser?._id === userItem._id && 'bg-blue-800'}`}
          >
            <img src={assets.avatar_icon} alt='profile' className='w-[35px] aspect-[1/1] rounded-full'/>
            <div> 
              <p>{userItem.fullName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Side