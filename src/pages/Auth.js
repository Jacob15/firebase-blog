
import React, {useState} from 'react'
import {toast} from 'react-toastify'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { auth } from '../firebase'
import {useNavigate} from 'react-router-dom'
const initialState={
  firstName:"",
  lastName:"",
  email:"",
  password:"",
  confirmPassword:""
}

const Auth = ({setActive}) => {
  const [state, setState]=useState(initialState)
  const [signup, setSignup]=useState(false)

  const {email, password, firstName, lastName, confirmPassword}=state

  const navigate= useNavigate()

  const handleChange=(e)=>{
    setState({...state, [e.target.name]:e.target.value})
  }

  const handleAuth=async(e)=>{
    e.preventDefault();
    if(!signup){
      if(email && password)
      {
        const {user} = await signInWithEmailAndPassword(auth, email, password)
        setActive("Home")
      }
      
      
      

    }
    else{
      if(password !==confirmPassword){
        return toast.error("Password don't match")
      }
      if(firstName && lastName && email && password){
        const {user}=await createUserWithEmailAndPassword(auth, email, password )
        await updateProfile(user, {displayName:`${firstName}${lastName}`})
        setActive("Home")
      }else{
        return toast.error("All fields are mandatory")
      }
    }
    navigate("/")
  }

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            { !signup ?"Sign In" : "Sign Up"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg6">
           
            <form className='row'  onSubmit={handleAuth}>
            {signup && ( 
              <>
               <div className="col-6 py-3">
                <input type="text" 
                className='form-control input-text-box'
                 placeholder='First Name'
                 name='firstName'
                 value={firstName}
                 onChange={handleChange}/>
              </div>
              <div className="col-6 py-3">
                <input type="text" 
                className='form-control input-text-box'
                 placeholder='Last Name'
                 name='lastName'
                 value={lastName}
                 onChange={handleChange}/>
              </div>
              </>
            )}
              <div className="col-12 py-3">
                <input type="email" 
                className='form-control input-text-box'
                 placeholder='Email'
                 name='email'
                 value={email}
                 onChange={handleChange}/>
              </div>
              <div className="col-12 py-3">
                <input type="password" 
                className='form-control input-text-box'
                 placeholder='Password'
                 name='password'
                 value={password}
                 onChange={handleChange}/>
              </div>
              {signup &&(
                <>
                <div className="col-12 py-3">
                <input type="password" 
                className='form-control input-text-box'
                 placeholder='Confirm Password'
                 name='confirmPassword'
                 value={confirmPassword}
                 onChange={handleChange}/>
                 </div>
                </>
              )}
              
              
              <div className="col-12 py-3 text-center">
                <button className={`btn ${!signup? "btn-sign-in": "btn-sign-up"}`}
                 type="submit"
                 >{!signup? "Sign In": "Sign Up"}</button>
              </div>
            </form>
            <div>
              {!signup ?(
                <>
                <div className="text-center justify-content-center mt-2 pt-2">
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?&nbsp;
                    <span className="link-danger" 
                    style={{textDecoration:"none", cursor:"pointer"}}
                    onClick={()=>setSignup(true)}>
                      Sign-Up
                    </span>
                  </p>
                </div>
                </>
              ):(
                <>
                <div className="text-center justify-content-center mt-2 pt-2">
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Already have an account?&nbsp; 
                    <span
                      style={{textDecoration:"none", cursor:"pointer", color:"#298af2"}}
                      onClick={()=>setSignup(false)}>
                      Sign In
                    </span>
                  </p>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
