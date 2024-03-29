import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import {FaUser} from 'react-icons/fa'
import { ToastContainer, toast } from "react-toastify";    
import "react-toastify/dist/ReactToastify.css";  
import Layout from '../../components/Layout';
import AuthContext from '../../context/AuthContext';
import styles from '../../styles/AuthForm.module.css'

export default function LoginPage() {
  const {login, error: loginError} = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    loginError && toast.error(loginError)                                            // Affiche l'erreur d'un mauvais l/p lors du login
  }, [loginError]);


  const handleSubmit = (e) => {
    e.preventDefault()
    login ({email, password})                                                       // POST à l'API et enregistre la réponse dans le context
  }

  return (
    <Layout title='User Login'>
      <div className={styles.auth}>
        <h1><FaUser /> Log In </h1>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email Address</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <input type='submit' value='login' className='btn' />
        </form>
        <p>Don't have an account? <Link href='/account/register'><a>Register</a></Link></p>
      </div>
    </Layout>
  )
}
