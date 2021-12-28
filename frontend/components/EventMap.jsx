// Composant utilisé dans /pages/events/[slug].jsx
// Utilise les API de mapbox.com & mapquest
// >>> yarn add react-map-gl  
import axios from 'axios'
import Image from "next/image";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";                  // https://github.com/visgl/react-map-gl
import "mapbox-gl/dist/mapbox-gl.css";


export default function EventMap({ evt }) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState({                    // Utilisé par react-map-gl (https://github.com/visgl/react-map-gl)
    latitude: 40.712772,
    longitude: -73.935242,
    width: "100%",
    height: "500px",
    zoom: 12,
  });


  useEffect(async() => {
    // Obtient le geocode à partir de l'adresse
    const { data } = await axios.get(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.NEXT_PUBLIC_MAPQUEST_TOKEN}&location=${evt.address}`)
    const { lat, lng } = data.results[0].locations[0].displayLatLng;
    setLatitude(lat);
    setLongitude(lng);
    setViewport({ ...viewport, latitude: lat, longitude: lng });
    setLoading(false);
  }, []);

  if (loading) return false;

  return (
    <ReactMapGL {...viewport} mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN} onViewportChange={(vp) => setViewport(vp)}>
      <Marker key={evt.id} latitude={latitude} longitude={longitude}>
        <Image src="/images/pin.svg" width={30} height={30} alt="" />
      </Marker>
    </ReactMapGL>
  );
}

