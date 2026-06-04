import React, { useContext, useEffect, useRef, useState} from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { convertTime } from '../lib/utils'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

const Chat = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages, deleteMessage} = useContext(ChatContext)
  const {authUser, onlineUsers } = useContext(AuthContext)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchIndexes, setMatchIndexes] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const messageRefs = useRef({});

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
    if(scrollEnd.current && messages && !searchQuery){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])

  useEffect(() => {
    const close = () => setContextMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setMatchIndexes([]); setCurrentMatch(0); return; }
    const indexes = messages.reduce((acc, msg, i) => {
      if (msg.text?.toLowerCase().includes(searchQuery.toLowerCase())) acc.push(i);
      return acc;
    }, []);
    setMatchIndexes(indexes);
    setCurrentMatch(0);
  }, [searchQuery, messages]);

  useEffect(() => {
    if (matchIndexes.length === 0) return;
    const msgId = messages[matchIndexes[currentMatch]]?._id;
    if (msgId && messageRefs.current[msgId]) {
      messageRefs.current[msgId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMatch, matchIndexes]);

  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return selectedUser ?(
    <div className='h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800'>
      {/* Header section */}
      <div className='flex items-center justify-between px-6 py-4 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <img 
              src={assets.avatar_icon} 
              alt='profile' 
              className='w-11 h-11 rounded-full border-2 border-purple-500/30 object-cover'
            />
            {isOnline && (
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full'></span>
            )}
          </div>
          <div>
            <p className='text-white font-semibold text-base'>{selectedUser.fullName}</p>
            <p className='text-xs text-slate-400'>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className='flex items-center gap-3'>
          <button onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(''); setMatchIndexes([]); }} className='p-2 hover:bg-slate-700/50 rounded-full transition-colors'>
            <svg className='w-5 h-5 text-slate-400 hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </button>
          {searchOpen && (
            <div className='flex items-center gap-2'>
              <input
                autoFocus
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Search messages...'
                className='px-3 py-1.5 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 outline-none focus:border-purple-500/50'
              />
              {matchIndexes.length > 0 && (
                <div className='flex items-center gap-1'>
                  <span className='text-xs text-slate-400'>{currentMatch + 1}/{matchIndexes.length}</span>
                  <button onClick={() => setCurrentMatch(p => p === 0 ? matchIndexes.length - 1 : p - 1)}
                    className='p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white'>
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7'/>
                    </svg>
                  </button>
                  <button onClick={() => setCurrentMatch(p => p === matchIndexes.length - 1 ? 0 : p + 1)}
                    className='p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white'>
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7'/>
                    </svg>
                  </button>
                </div>
              )}
              {searchQuery && matchIndexes.length === 0 && (
                <span className='text-xs text-slate-500'>No results</span>
              )}
            </div>
          )}
          <div className='relative'>
            <button onClick={() => setMenuOpen(!menuOpen)} className='p-2 hover:bg-slate-700/50 rounded-full transition-colors'>
              <svg className='w-5 h-5 text-slate-400 hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
              </svg>
            </button>
            {menuOpen && (
              <div className='absolute top-full right-0 mt-2 w-40 z-20 rounded-xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-md shadow-xl'>
                <button onClick={() => { setSelectedUser(null); setMenuOpen(false); }} className='w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 rounded-xl'>
                  Close chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages section */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'>
         {messages.map((msg, index) => (
          msg.text && (
            <div 
              key={msg._id} 
              className={`flex items-end gap-2 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            > 
              {msg.senderId !== authUser._id && (
                <img 
                  src={assets.avatar_icon} 
                  alt='avatar' 
                  className='w-8 h-8 rounded-full border-2 border-slate-700/50 object-cover mb-1' 
                />
              )}
              
              <div className={`flex flex-col ${msg.senderId === authUser._id ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div
                  ref={el => messageRefs.current[msg._id] = el}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (msg.senderId === authUser._id) {
                      setContextMenu({ msgId: msg._id, x: e.clientX, y: e.clientY });
                    }
                  }}
                  className={`group relative px-4 py-2.5 rounded-2xl shadow-lg transition-all ${
                    searchQuery && msg.text?.toLowerCase().includes(searchQuery.toLowerCase()) && matchIndexes[currentMatch] === index
                      ? 'ring-2 ring-yellow-400/80 scale-105'
                      : searchQuery && msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
                      ? 'ring-1 ring-yellow-400/30'
                      : ''
                  } ${
                    msg.senderId === authUser._id 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-br-sm' 
                      : 'bg-slate-700/80 text-white rounded-bl-sm'
                  }`}>
                  <p className='text-sm leading-relaxed break-words'>{msg.text}</p>
                  
                  {/* Hover timestamp */}
                  <span className='absolute -bottom-6 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                    {convertTime(msg.createdAt)}
                  </span>
                </div>
                
                {/* Show timestamp for last message or every 5th message */}
                {(index === messages.length - 1 || index % 5 === 0) && (
                  <span className='text-[10px] text-slate-500 mt-1 px-1'>
                    {convertTime(msg.createdAt)}
                  </span>
                )}
              </div>

              {msg.senderId === authUser._id && (
                <img 
                  src={assets.avatar_icon} 
                  alt='avatar' 
                  className='w-8 h-8 rounded-full border-2 border-purple-500/30 object-cover mb-1' 
                />
              )}
            </div>
          )
         ))}
         {contextMenu && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ 
                position: 'fixed', 
                top: contextMenu.y - 10,
                left: contextMenu.x - 130,
                zIndex: 50 
              }}
              className='bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 min-w-[120px]'
            >
              <button
                onClick={() => { deleteMessage(contextMenu.msgId); setContextMenu(null); }}
                className='w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700/50 rounded-xl'
              >
                Delete message
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className='w-full px-4 py-2 text-left text-sm text-slate-400 hover:bg-slate-700/50 rounded-xl'
              >
                Cancel
              </button>
            </div>
          )}
         <div ref={scrollEnd}></div>
      </div>

      {/* Input section */}
      <div className='px-4 py-4 bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50'>
        <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-slate-700/50 rounded-full px-4 py-1 border border-slate-600/50 focus-within:border-purple-500/50 transition-all'>
            <input 
              onChange={(e)=> setInput(e.target.value)} 
              value={input} 
              onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null } 
              type="text" 
              placeholder='Type a message...' 
              className='flex-1 text-sm py-2.5 bg-transparent border-none outline-none text-white placeholder-slate-400' 
            />
            <button 
              type='button'
              className='p-1.5 hover:bg-slate-600/50 rounded-full transition-colors'
            >
              <svg className='w-5 h-5 text-slate-400 hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </button>
          </div>

          <button 
            type='submit'
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className='p-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
              rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed 
              transform hover:scale-105 active:scale-95 flex-shrink-0'
          >
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
            </svg>
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-6 h-full bg-gradient-to-b from-slate-900 to-slate-800 max-md:hidden'>
      <div className='relative'>
        <div className='absolute inset-0 bg-purple-500/20 rounded-full blur-3xl'></div>
        <div className='relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50'>
          <img src={assets.logo_chat} alt='logo' className='w-24 h-24 opacity-80' />
        </div>
      </div>
      <div className='text-center space-y-2'>
        <h3 className='text-2xl font-bold text-white'>Welcome to Chat</h3>
        <p className='text-slate-400 text-sm max-w-xs'>
          Select a conversation from the sidebar to start messaging
        </p>
      </div>
      <div className='flex gap-2'>
        <div className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'></div>
        <div className='w-2 h-2 bg-indigo-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
        <div className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  )
}
export default Chat