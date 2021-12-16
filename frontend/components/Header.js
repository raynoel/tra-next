import { useContext } from 'react'
import {FaSignInAlt, FaSignOutAlt} from 'react-icons/fa'
import Link from 'next/link'
import Search from './Search'
import AuthContext from '../context/AuthContext'
import styles from '../styles/Header.module.css'

export default function Header() {
  const {user, logout} = useContext(AuthContext)

  return (
    <header className={styles.header}>

      <div className={styles.logo}><Link href='/'>DJ Events</Link></div>

      <Search />

      <nav>
        <ul>
          <li><Link href='/events'>Events</Link></li>
          {  user && <li><Link href='/events/add'><a>Add Event</a></Link></li> }
          {  user && <li><Link href="/account/dashboard"><a>Dashboard</a></Link></li> }
          {  user && <li><button className="btn-secondary btn-icon" onClick={() => logout()}><FaSignOutAlt /> Logout</button></li> }
          { !user && <li><Link href='/account/login'><a className='btn-secondary btn-icon'><FaSignInAlt /> Login </a></Link></li> }
        </ul>
      </nav>

    </header>
  )
}
