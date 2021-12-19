// Envoie l/p au backend  qui retourne un token et les données de l'usagé
import axios from 'axios' 
import cookie from 'cookie'                                                           // Cré un cookie dans le backend
import { BACKEND_URL } from '../../config/index'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { identifier, password } = req.body 
      const config = { headers: { 'Content-Type': 'application/json' }}
      const { data } = await axios.post(`${BACKEND_URL}/auth/local`, {identifier, password}, config)
      res.setHeader(                                                                  // Cré un cookie dans le serveur
        'Set-Cookie', 
        cookie.serialize('token', data.jwt, {                                         // cookie.serialize('nom', valeur, options)
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',                             // utilise https
          maxAge: 60 * 60 * 24 * 7,                                                   // 1 semaine
          sameSite: 'strict',
          path: '/'
        })
      )
      res.status(200).json({ user: data.user })
    } catch (error) {
      res.status(error.response.status).json({ message: error.response.statusText })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}