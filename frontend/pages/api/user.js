// Vérifie si l'usagé est 'logged in' en vérifiant son cookie
import { BACKEND_URL } from '../../config/index.js'
import axios from "axios";
import cookie from 'cookie'

export default async (req, res) => {
  if (!req.headers.cookie) { 
    res.status(200).json({ user: null });
    // res.status(403).json({ message: "Not Authorized" });
    return 
  }
  if ( req.method === "GET") {
    try { 
      const { token } = cookie.parse(req.headers.cookie);                             // Extrait le cookie nommé 'token'
      const config = { headers: { Authorization: `Bearer ${token}`}}  
      const { data: user } = await axios.get(`${BACKEND_URL}/users/me`, config)
      res.status(200).json({ user });
    } catch (error) {
      res.status(403).json({ message: "User forbidden" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
