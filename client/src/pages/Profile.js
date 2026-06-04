import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import assets from '../assets/assets'

const Profile = ({ onClose }) => {
  const { authUser } = useContext(AuthContext)

  return (
    <div className='h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-8'>
      <div className='w-full max-w-sm bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center gap-6'>
        
        <div className='relative'>
          <img src={assets.avatar_icon} alt='profile' className='w-24 h-24 rounded-full border-4 border-purple-500/40 object-cover' />
          <span className='absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full'></span>
        </div>

        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white'>{authUser?.fullName}</h2>
          <p className='text-slate-400 text-sm mt-1'>{authUser?.email}</p>
        </div>

        <div className='w-full space-y-3'>
          <div className='bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600/30'>
            <p className='text-xs text-slate-500 mb-1'>Full name</p>
            <p className='text-white text-sm font-medium'>{authUser?.fullName}</p>
          </div>
          <div className='bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600/30'>
            <p className='text-xs text-slate-500 mb-1'>Email</p>
            <p className='text-white text-sm font-medium'>{authUser?.email}</p>
          </div>
          <div className='bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600/30'>
            <p className='text-xs text-slate-500 mb-1'>Member since</p>
            <p className='text-white text-sm font-medium'>
              {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className='w-full py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors border border-slate-600/50'
        >
          Back to chat
        </button>
      </div>
    </div>
  )
}

export default Profile