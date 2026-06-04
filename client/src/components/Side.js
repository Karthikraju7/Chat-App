import React, { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import Profile from '../pages/Profile'

const Side = () => {

  const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);
  const {logout, onlineUsers, authUser} = useContext(AuthContext)
  const [input, setInput] = useState(false)
  const filteredUsers = input ? users.filter((user)=> user.fullName.toLowerCase().includes(input.toLowerCase())): users;
  const [userOrder, setUserOrder] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  useEffect(() => { setUserOrder(users); }, [users]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className={`relative h-full flex flex-col bg-slate-800 border-r border-slate-700/50 ${selectedUser ? "max-md:hidden" : ""}`}>
      {/* Header Section */}
      <div className='p-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-md'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg'>
              <img src={assets.logo_chat} alt='logo' className='w-8 h-8' />
            </div>
            <div>
              <h2 className='text-white font-bold text-lg'>Messages</h2>
              <p className='text-xs text-slate-400'>{users.length} contacts</p>
            </div>
          </div>
          
          {/* Menu Dropdown */}
          <div className='relative'>
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }} className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'>
              <svg className='w-5 h-5 text-slate-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
              </svg>
            </button>
            {menuOpen && (
              <div className='absolute top-full right-0 mt-2 w-48 z-20 rounded-xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-md shadow-xl'>
                <div className='py-2'>
                  <button onClick={() => { setShowProfile(true); setMenuOpen(false); }} className='w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center gap-3'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                    Profile
                  </button>
                  <div className='border-t border-slate-700/50 my-1'></div>
                  <button onClick={() => logout()} className='w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <input 
            onChange={(e)=>setInput(e.target.value)} 
            type='text' 
            placeholder='Search conversations...' 
            className='w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all'
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'>
        {filteredUsers.length > 0 ? (
          <div className='p-2'>
            {filteredUsers.map((userItem) => {
              const isOnline = onlineUsers?.includes(userItem._id);
              const unreadCount = unseenMessages?.[userItem._id] || 0;
              
              return (
                <div 
                  onClick={()=> {
                    setSelectedUser(userItem); 
                    setUnseenMessages(prev=>({
                      ...prev , [userItem._id]:0
                    }))
                  }}
                  key={userItem._id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 group
                    ${selectedUser?._id === userItem._id 
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30' 
                      : 'hover:bg-slate-700/30'
                    }`}
                >
                  <div className='relative flex-shrink-0'>
                    <img 
                      src={assets.avatar_icon} 
                      alt='profile' 
                      className='w-12 h-12 rounded-full object-cover border-2 border-slate-600/50'
                    />
                    {isOnline && (
                      <span className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-800 rounded-full'></span>
                    )}
                  </div>
                  
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <p className={`font-medium text-sm truncate ${
                        selectedUser?._id === userItem._id ? 'text-white' : 'text-slate-200'
                      }`}>
                        {userItem.fullName}
                      </p>
                      {unreadCount > 0 && (
                        <span className='flex-shrink-0 ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs font-semibold rounded-full'>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-slate-400 truncate'>
                      {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedUser?._id === userItem._id ? 'opacity-100' : ''
                  }`}>
                    <svg className='w-5 h-5 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full px-4 text-center'>
            <svg className='w-16 h-16 text-slate-600 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
            </svg>
            <p className='text-slate-400 text-sm'>No contacts found</p>
            <p className='text-slate-500 text-xs mt-1'>Try a different search term</p>
          </div>
        )}
      </div>
      {showProfile && (
        <div className='absolute inset-0 z-30'>
          <Profile onClose={() => setShowProfile(false)} />
        </div>
      )}
    </div>
  )
}

export default Side