import React, { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {
  //linking api with frontend..now we have to make "Login Here " functional so that we can login and signup from the same page
  const [state,setState]=useState("Login")
  //we have to add api for login signup page
  //now we'll create state variable to save our input field data
  const [formData,setFormData]=useState({
    username:"",
    password:"",
    email:""
  })//we'll use this form data to get data from input field
  //we will use onchange property and create a change handler function
  const changeHandler=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const login= async ()=>{
    console.log("Login function executed",formData);
    let responseData;
    await fetch('https://shopx-5097.onrender.com/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)
    if(responseData.success){//means our username and password r correct and token has been generated
      //in this case we'll add authentication token in local storag
      localStorage.setItem('auth-token',responseData.token)
      //after being logged in we'll send the user to the home page
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }
  const signup= async ()=>{
    console.log("Signup function executed",formData);
    let responseData;
    await fetch('https://shopx-5097.onrender.com/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)
    if(responseData.success){//means our username and password r correct and token has been generated
      //in this case we'll add authentication token in local storag
      localStorage.setItem('auth-token',responseData.token)
      //after being logged in we'll send the user to the home page
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type='text' placeholder='Your Name'/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type='email' placeholder='Email Address'/>
          <input name='password' value={formData.password} onChange={changeHandler} type='password' placeholder='Password'/>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up" ?
        <p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login Here</span> </p>
        :<p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click Here</span> </p>
        } 
        
        <div className="loginsignup-agree">
          <input type='checkbox' name='' id=''/>
          <p>By continuing i agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup