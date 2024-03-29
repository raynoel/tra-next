import axios from 'axios'
import cookie from "cookie";
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { FaImage } from 'react-icons/fa'
import moment from 'moment'
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";                                     
import Layout from '../../../components/Layout.jsx'
import Modal from "../../../components/Modal.jsx";
import ImageUpload from '../../../components/ImageUpload.jsx'
import {BACKEND_URL} from '../../../config/index.js'
import styles from '../../../styles/Form.module.css'





export default function EditEventPage({ evt, token }) {
  const router = useRouter();
  const [imageThumbnail, setImageThumbnail] = useState(evt.image ? evt.image.formats.thumbnail.url : null)
  const [showModal, setShowModal] = useState(false)
  const [values, setValues] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });



  const handleSubmit = async (e) => {
    e.preventDefault()
    // Valide les champs
    const hasEmptyFields = Object.values(values).some((element) => element === "" );
    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
      return;
    }
    // UPDATE 
    try { 
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }}
      const { data: updatedEvent } = await axios.put(`${BACKEND_URL}/events/${evt.id}`, values, config)
      router.push(`/events/${updatedEvent.slug}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;                                                           // Extrait le nom du champ et sa valeur de l'obj e
    setValues({ ...values, [name]: value });                                                    // Ajoute les valeurs à l'obj 'values'
  };



  const showNewThumbnail = async (e) => {
    const { data } = await axios.get(`${BACKEND_URL}/events/${evt.id}`);
    setImageThumbnail(data.image.formats.thumbnail.url);
    setShowModal(false);
  };


  return (
    <Layout title='Edit Event'>
      <Link href='/events'>Go Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />                                                                         {/* Affiche les msg d'erreur ici */}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input type="text" id="name" name="name" value={(values.name)} onChange={(handleInputChange)} />
          </div>
          <div>
            <label htmlFor="performers">Performers</label>
            <input type="text" name="performers" id="performers" value={values.performers} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input type="text" name="venue" id="venue" value={values.venue} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input type="text" name="address" id="address" value={values.address} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input type="date" name="date" id="date" value={moment(values.date).format('yyyy-MM-DD')} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input type="text" name="time" id="time" value={values.time} onChange={handleInputChange} />
          </div>
        </div>
        <div>
          <label htmlFor="description">Event Description</label>
          <textarea type="text" name="description" id="description" value={values.description} onChange={handleInputChange}></textarea>
        </div>
        <input type="submit" value="Update Event" className="btn" />
      </form>

      {/* IMAGE */}
      <h2>Event Image</h2>
      {imageThumbnail ? <Image src={imageThumbnail} width={170} height={100} /> : <div><p>No image uploaded</p></div> }
      
      <div><button className="btn-secondary" onClick={() => setShowModal(true)}><FaImage /> Upload Image </button></div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={evt.id} showNewThumbnail={showNewThumbnail} token={token} />
      </Modal>

    </Layout>
  )
}



// Obtient l'event 'id' de la DB
export async function getServerSideProps({req,  params: {id} }) {                           // extrait le 'id' du url
  const userCookie = cookie.parse(req ? req.headers.cookie || "" : "");                     // si pas de cookie, retourne une chaine vide. Si pas de req, retourne une chaine vide
  const token = userCookie.token ? userCookie.token : "";
  const { data: event } = await axios.get(`${BACKEND_URL}/events/${id}`)                    // Obtient un obj event
  return {
    props: { 
      evt: event,
      token
     }
  }
}