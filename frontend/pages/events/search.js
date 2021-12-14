// URL query -> GET http://localhost:3000/events/search?term=boom%20dance
import qs from 'qs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from "../../components/Layout"
import EventItem from '../../components/EventItem.jsx'
import { API_URL } from '../../config/index.js'


export default function SearchPage({ events }) {
  const router = useRouter()                                              // Obtient le URL
  return (
    <Layout>
      <Link href='/events'>Go Back</Link>
      <h1>Search Results for {router.query.term}</h1>
      {events.lenght === 0 && <h3>No Events to show</h3>}
      {events.map((evt) => <EventItem key={evt.id} evt={evt} />)}
    </Layout>
  )
}

// Obtient les données de la DB
export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify({
    _where: {
      _or: [
        { name_contains: term },
        { performers_contains: term },
        { description_contains: term },
        { venue_contains: term },
      ],
    },
  });
  const {data: events} = await axios.get(`${API_URL}/events?${query}`)
  return { 
    props: { events } 
  }
}
