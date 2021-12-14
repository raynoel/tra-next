import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from "react-toastify";    
import "react-toastify/dist/ReactToastify.css";  
import {FaPencilAlt, FaTimes} from 'react-icons/fa'
import Layout from '../../components/Layout.jsx'
import styles from '../../styles/Event.module.css'
import { API_URL } from '../../config/index.js'


export default function EventPage({ evt }) {
  const router = useRouter();

  const deleteEvent = async (e) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/events/${evt.id}`) 
        router.push(`/events`)
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <Layout>
      <ToastContainer />
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}><a><FaPencilAlt /> Edit Event</a></Link>
          <a href='#' className={styles.delete} onClick={deleteEvent}><FaTimes /> Delete Event</a>
        </div>
        <span>{new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}</span>
        <h1>{evt.name}</h1>
        {evt.image && ( <div className={styles.image}><Image src={evt.image.formats.medium.url} width={960} height={600} layout="responsive" /></div> )}
        <h3>Performers:</h3>
        <p>{evt.performers}</p>
        <h3>Description:</h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>
        <Link href='/events'><a className={styles.back}>{'<­'} Go Back</a></Link>
      </div>
    </Layout>
  )
}


export async function getStaticPaths() {
  let { data: events } = await axios.get(`${API_URL}/events`)                     // Obtient le tb des obj events
  let paths = events.map((evt) => ({ params: { slug: evt.slug } }))               // Cré un tb path contenant des obj {params: { slug: ''}}
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params: { slug } }) {                      // extrait la propriété params.slug
  let response = await axios.get(`${API_URL}/events?slug=${slug}`)                // Obtient le tb des obj events corresponsant au 'slug'
  const tb_events = response.data
  return {
    props: { evt: tb_events[0] },
    revalidate: 1,
  }
}


// export async function getServerSideProps({ query: {slug} }) {                           // extrait la propriété 'slug' du query
//   const { data: events } = await axios.get(`${API_URL}/events/${slug}`)             // Obtient un tb d'obj events contenant un obj
//   return {
//     props: { evt: events[0] }
//   }
// }
