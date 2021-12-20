import axios from 'axios'
import cookie from "cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../components/Layout";
import { BACKEND_URL } from "../../config/index";
import styles from "../../styles/Dashboard.module.css";



export default function DashboardPage({ events, token }) {

  console.log(events)

  return (
    <Layout title="User Dashboard">
      <div className={styles.dash}>
        <h1>Dashboard</h1>
        <h3>My Events</h3>
        { events.map((evt) => 
          <div key={evt.id}>{evt.name}</div>
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
