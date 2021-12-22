import axios from 'axios'
import cookie from "cookie";
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ToastContainer, toast } from "react-toastify";    
import "react-toastify/dist/ReactToastify.css";                                     
import Layout from '../../components/Layout.jsx'
import {BACKEND_URL} from '../../config/index'
import styles from '../../styles/Form.module.css'


export default function AddEventPage({ token }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    performers: "",
    venue: "",
    address: "",
    date: "",
    time: "",
    description: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault()
    // Valide les champs
    const hasEmptyFields = Object.values(values).some((element) => element === "" );
    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
      return;
    }
    // POST à l'API
    try { 
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }}
      const { data: newEvent } = await axios.post(`${BACKEND_URL}/events`, values, config)
      router.push(`/events/${newEvent.slug}`);
    } catch (error) {
      if (error.response.status === 403 || error.response.status === 401){
        toast.error("Unauthorized")
        return
      }
      toast.error("Something went wrong");
    }
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;                                                           // Extrait le nom du champ et sa valeur de l'obj e
    setValues({ ...values, [name]: value });                                                    // Ajoute les valeurs à l'obj 'values'
  };


  return (
    <Layout title='Add New Event'>
      <Link href='/events'>Go Back</Link>
      <h1>Add Event</h1>
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
            <input type="date" name="date" id="date" value={values.date} onChange={handleInputChange} />
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
        <input type="submit" value="Add Event" className="btn" />
      </form>

    </Layout>
  )
}


export async function getServerSideProps({ req }) {
  const userCookie = cookie.parse(req ? req.headers.cookie || "" : "");          // si pas de cookie, retourne une chaine vide. Si pas de req, retourne une chaine vide
  const token = userCookie.token ? userCookie.token : "";
  return {
    props: {
      token,
    },
  };
}