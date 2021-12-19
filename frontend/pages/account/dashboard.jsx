import axios from 'axios'
import cookie from "cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../components/Layout";
import { BACKEND_URL } from "../../config/index";
import styles from "../../styles/Dashboard.module.css";



export default function DashboardPage({ user, events, token }) {
  const router = useRouter();

  console.log(user)
  const deleteEvent = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}`}}  
        await axios.delete(`${BACKEND_URL}/events/${id}`, config)
        router.reload();
      } catch (error) {
        toast.error(data.message);
      }
    }
  };

  return (
    <Layout title="User Dashboard">
      <div className={styles.dash}>
        <h1>Dashboard of {user.username}</h1>
        <h3>My Events</h3>
        {/* {events.map((evt) => (
          <DashboardEvent key={evt.id} singleEvent={evt} handleDelete={deleteEvent} />
        ))} */}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = cookie.parse(req ? req.headers.cookie || "" : "");
  const config = { headers: { Authorization: `Bearer ${token}`}}  
  let { data: user } = await axios.get(`${BACKEND_URL}/users/me`, config)
  let { data: events } = await axios.get(`${BACKEND_URL}/events/me`, config)

  return {
    props: {
      user,
      events,
      token
    },
  };
}
