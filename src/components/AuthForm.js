import React, { useState } from 'react'
import { authService } from 'fbase'

const AuthForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newAccount, setNewAccount] = useState(true)
  const [error, setError] = useState('')

  const onChange = (event) => {
    const { target: { name, value } } = event // event.target. ...
    if (name === 'email') setEmail(value)
    else if (name === 'password') setPassword(value)
  }
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      let data
      if (newAccount) data = await authService.createUserWithEmailAndPassword(
        email, password
      )
      else data = await authService.signInWithEmailAndPassword(email, password)
      console.log('submit!', data)
    } catch (error) {
      setError(error.message)
    }
  }
  const toggleAccount = () => setNewAccount(prev => !prev)

  return (
    <>
      <form
        className="container"
        onSubmit={onSubmit}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={ newAccount ? 'Create Account' : 'Sign In' }
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span 
        onClick={toggleAccount}
        className="authSwitch"
      >
        {newAccount ? 'Sign in' : 'Create Account'}
      </span>
    </>
  )
}
export default AuthForm