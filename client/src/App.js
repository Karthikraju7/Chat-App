import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import {Toaster} from "react-hot-toast"
import { AuthContext } from './context/AuthContext'
 
 const App = () => {
  const {authUser} = useContext(AuthContext)
   return (
     <div className='bg-blue-400'>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser? <Login /> : <Navigate to="/" />}/>
      </Routes>
     </div>
   )
 }

 export default App 