import React from 'react'
import AuthForm from '../components/AuthForm'

const Login = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}

export default Login
