import Link from 'next/link'
import axios from 'axios'
import Layout from "../components/Layout.jsx"
import EventItem from '../components/EventItem.jsx'
import { BACKEND_URL } from '../config/index.js'


export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming Eventse</h1>
      {events.length === 0 && <h3>No Events to show</h3>}
      {events.map((evt) => 
        <EventItem key={evt.id} evt={evt} />
      )}
      {events.length > 0 && <Link href='/events'><a className='btn-secondary'>View All Events</a></Link>}
    </Layout>
  )
}

// Obtient les données de la DB
export async function getStaticProps() {
  const {data: events} = await axios.get(`${BACKEND_URL}/events?_sort=date:ASC&_limit=3`)
  return {
    props: { events },
    revalidate: 1                      // Option pour simuler un observer, refait la requête après 1 seconde si la DB fut modifiée
  }
}
