import axios from 'axios'
import cookie from "cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";    
import "react-toastify/dist/ReactToastify.css";     
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import Layout from "../../components/Layout";
import { BACKEND_URL } from "../../config/index";
import styles from "../../styles/Dashboard.module.css";



export default function DashboardPage({ events, token }) {
  const router = useRouter();

  const deleteEvent =  (id) => {
    if (confirm("Are you sure?")) {
      const config = { headers: { Authorization: `Bearer ${token}`}} 
      axios.delete(`${BACKEND_URL}/events/${id}`, config)
      .then(() => { router.reload() } )
      .catch(error => {
        if (error.response.status === 403 || error.response.status === 401) {
          toast.error("Unauthorized");
          return
        }
        toast.error("Something went wrong");
      })
    }
  }

  return (
    <Layout title="User Dashboard">
      <div className={styles.dash}>
        <ToastContainer />
        <h1>Dashboard</h1>
        <h3>My Events</h3>
        { events.map((evt) => 
          <div className={styles.event} key={evt.id}>
            <Link href={`/events/${evt.slug}`}><h4><a>{evt.name}</a></h4></Link>
            <Link href={`/events/edit/${evt.id}`}><a className={styles.edit}><FaPencilAlt /> Edit</a></Link>
            <a href="#" className={styles.delete} onClick={() => deleteEvent(evt.id)}><FaRegTrashAlt /></a>
          </div>
        )}
      </div>
    </Layout>
  );
}


// Obtient les enregistrements soumis par l'usagé
export async function getServerSideProps({ req }) {
  const { token } = cookie.parse(req ? req.headers.cookie || "" : "");          // si pas de cookie, retourne une chaine vide. Si pas de req, retourne une chaine vide
  const config = { headers: { Authorization: `Bearer ${token}`}}  
  const { data: events } = await axios.get(`${BACKEND_URL}/events/me`, config)  // Obtient les enregistrements de l'usagé

  return {
    props: {
      events,
      token
    },
  };
}
