import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout.jsx'
import EventMap from '../../components/EventMap.jsx'
import styles from '../../styles/Event.module.css'
import { BACKEND_URL } from '../../config/index.js'


export default function EventPage({ evt }) {
  const router = useRouter();


  return (
    <Layout>
      <div className={styles.event}>
        <span>{new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}</span>
        <h1>{evt.name}</h1>
        {evt.image && ( <div className={styles.image}><Image src={evt.image.formats.medium.url} width={960} height={600} layout="responsive" /></div> )}
        <h3>Performers:</h3>
        <p>{evt.performers}</p>
        <h3>Description:</h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>

        <EventMap evt={evt} />

        <Link href='/events'><a className={styles.back}>{'<­'} Go Back</a></Link>
      </div>
    </Layout>
  )
}


export async function getStaticPaths() {
  let { data: events } = await axios.get(`${BACKEND_URL}/events`)                     // Obtient le tb des obj events
  let paths = events.map((evt) => ({ params: { slug: evt.slug } }))               // Cré un tb path contenant des obj {params: { slug: ''}}
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params: { slug } }) {                      // extrait la propriété params.slug
  let response = await axios.get(`${BACKEND_URL}/events?slug=${slug}`)                // Obtient le tb des obj events corresponsant au 'slug'
  const tb_events = response.data
  return {
    props: { evt: tb_events[0] },
    revalidate: 1,
  }
}


// export async function getServerSideProps({ query: {slug} }) {                           // extrait la propriété 'slug' du query
//   const { data: events } = await axios.get(`${BACKEND_URL}/events/${slug}`)             // Obtient un tb d'obj events contenant un obj
//   return {
//     props: { evt: events[0] }
//   }
// }
