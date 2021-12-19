import axios from 'axios'
import Layout from "../../components/Layout.jsx"
import EventItem from '../../components/EventItem.jsx'
import Pagination from '../../components/Pagination.jsx'
import { BACKEND_URL, PER_PAGE } from '../../config/index.js'


export default function EventPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.lenght === 0 && <h3>No Events to show</h3>}
      {events.map((evt) => <EventItem key={evt.id} evt={evt} />)}
      <Pagination page={page} total={total} />
    </Layout>
  )
}

// Pagination + Obtient les données de la DB
export async function getServerSideProps({ query: { page = 1 }}) {                     // obtient ?page= du URL
  // Calcul le start
  page = parseInt(page)
  const start = page === 1 ? 0 : (page - 1) * PER_PAGE;
  const {data: total}  = await axios.get(`${BACKEND_URL}/events/count`);
  const {data: events} = await axios.get(`${BACKEND_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`)
  return {
    props: { events, page, total },
  }
}