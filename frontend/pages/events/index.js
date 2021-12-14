import axios from 'axios'
import Layout from "../../components/Layout.jsx"
import EventItem from '../../components/EventItem.jsx'
import { API_URL } from '../../config/index.js'


export default function EventPage({ events }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.lenght === 0 && <h3>No Events to show</h3>}
      {events.map((evt) => <EventItem key={evt.id} evt={evt} />)}
    </Layout>
  )
}

// Obtient les données de la DB
export async function getStaticProps() {
  const {data: events} = await axios.get(`${API_URL}/events?_sort=date:ASC`)
  return {
    props: { events },
    revalidate: 1                      // Option pour simuler un observer, refait la requête après 1 seconde si la DB fut modifiée
  }
}
