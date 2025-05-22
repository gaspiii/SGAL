import React, { useState } from 'react'
import AuthForm from '../components/AuthForm'

const Login = () => {
  const [hasAccounts, setHasAccounts] = useState(false)

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm hasAccounts={hasAccounts} setHasAccounts={setHasAccounts} />
      </div>
    </div>
  )
}

export default Login
