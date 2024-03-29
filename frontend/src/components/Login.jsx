import React from 'react'
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import {client} from '../client'
import jwtDecode from 'jwt-decode'

const Login = () => {
  const navigate = useNavigate()
  const responseGoogle = (response) => {
    const decoded = jwtDecode(response.credential)
    localStorage.setItem('user', JSON.stringify(decoded))
    console.log(decoded)
    const {name, sub : googleId, picture : imageUrl} = decoded

    const doc = {
      _id : googleId,
      _type : 'user',
      userName : name,
      image : imageUrl
    }
    // console.log(doc)
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', {replace:true})
      })
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src = {shareVideo}
          type = "video/mp4"
          loop
          controls = {false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src = {logo} width="160px" alt="logo"/>
          </div>  
            <GoogleOAuthProvider clientId= {process.env.REACT_APP_GOOGLE_API_TOKEN} >
              <GoogleLogin
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  )
}

export default Login