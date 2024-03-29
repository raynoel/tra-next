import axios from 'axios'
import { useState } from 'react'
import PuffLoader from "react-spinners/PuffLoader";
import {BACKEND_URL} from '../config/index'
import styles from '../styles/Form.module.css'

export default function ImageUploads({ evtId, showNewThumbnail, token }) {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  // Upload l'image sur le serveur et appel une fct pour afficher le nouveau thumbnail
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("files", image);
    formData.append("ref", "events");
    formData.append("refId", evtId);
    formData.append("field", "image");
    const config = { headers: { Authorization: `Bearer ${token}` }}
    axios.post(`${BACKEND_URL}/upload`, formData, config)
    .then(() => {
      setLoading(false)
      showNewThumbnail()
    })
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };



  return (
    <div className={styles.form}>
      <h1>Upload Event Image</h1>
      <div className={styles.spinner}><PuffLoader loading={loading} color={'navy'} size={150} /></div>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" onChange={handleFileChange} />
        </div>
        <input type="submit" value="Upload" className="btn" />
      </form>
    </div>
  );
}

