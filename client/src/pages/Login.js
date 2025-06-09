import React, {useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const Login = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const [submitted, setSubmitted] = useState(false);  
  // this submitted is to redirect to bio when curstate ="signup"
  const {login} = useContext(AuthContext)


  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(currState === "Sign up" ? 'signup' : 'login', {
        fullName,
        email,
        password
      });
      navigate('/');
    } catch (err) {
      console.error("Auth error", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-cover bg-center'>
      <form onSubmit={handleSubmit}
      className='border-8 bg-white/10 text-white border-blue-500 
      p-6 flex flex-col gap-6 rounded-lg shadow-lg'>  
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
        </h2>
        {currState === "Sign up" && !submitted && (
        <input onChange={(e) => setFullName(e.target.value)} value={fullName}
        type='text' className='p-2 border bg-blue-500/20 border-gray-500 rounded-md focus:outline-none text-white placeholder-white/60' 
        placeholder='Full Name' required />
        )}
        {!submitted && (
             <>
             <input onChange={(e) => setEmail(e.target.value)} value={email}
             type='email' placeholder='E-mail' required 
             className='p-2 border bg-blue-500/20 border-gray-500 rounded-md focus:outline-none text-white placeholder-white/60' />
             <input onChange={(e) => setpassword(e.target.value)} value={password}
             type="password" placeholder='Password' required 
             className='p-2 border bg-blue-500/20 border-gray-500 rounded-md focus:outline-none text-white placeholder-white/60' />
             </>
        )
      }
      <button type='submit' className='rounded-md cursor-pointer py-3 bg-black'>
        {currState === "Sign up" ? "Create Account" : "Login Now"}
      </button>
      <div className='flex flex-col gap-2'>
        {currState === "Sign up" ? (
          <p className='text-sm text-gray-600'>Already have an account<span onClick={() => {setCurrState("Login");setSubmitted(false)}}
          className='font-medium cursor-pointer text-white'> Login</span></p>
        ) : (
          <p className='text-sm text-gray-600'>Create Account<span onClick={() => {setCurrState("Sign up")}}
          className='font-medium cursor-pointer text-white'> Sign up</span></p>
        )}
      </div>

      </form>
       
    </div>
  )
}

export default Login   