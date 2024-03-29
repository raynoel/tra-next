import axios from "axios";
import cookie from "cookie";
import { BACKEND_URL } from "../../config/index";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { username, email, password } = req.body;
      const config = { headers: { 'Content-Type': 'application/json'}} 
      const { data } = await axios.post(`${BACKEND_URL}/auth/local/register`, {username, email, password}, config)
      // Set cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 7,                                                   // 1 week
          sameSite: "strict",
          path: "/",
        })
      );
      res.status(200).json({ user: data.user });
    } catch (error) {
      res.status(error.response.status).json({ message: error.response.statusText })
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
