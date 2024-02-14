import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import IPoint, { IPosition } from '../../interfaces/IPoint';
import './MapComponent.css'

import RoundFilter from '../roundFilter/RoundFilter';
import MapNav from '../mapNav/MapNav';
import MapPoints from '../mapPoints/MapPoints';

const MapComponent = () => {
  const [points, setPoints] = useState<IPoint>();
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLDivElement>(null);

  const mapOptions = {
    mapId: import.meta.env.VITE_GOOGLEMAPS_ID,
    center: {lat: 55.006327637017975, lng: 82.92463415405926 },
    zoom: 13,
    disableDefaultUI: true,
  };

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, mapOptions));
    }
  }, [ref, map]);

  useEffect(() => {
    axios.get(`http://localhost:5000/getpointsmap`)
      .then(res => {
        setPoints(JSON.parse(res.data));
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const panToWithOffset = (latlng: IPosition, offsetX: number, offsetY: number) => {
    if (map) {
      const ov = new window.google.maps.OverlayView();
      ov.onAdd = function() {
        const proj = this.getProjection();
        const pixelPoint = proj.fromLatLngToContainerPixel(latlng);
        if (pixelPoint) {
          pixelPoint.x = pixelPoint.x + offsetX;
          pixelPoint.y = pixelPoint.y + offsetY;
          const latLngPoint = proj.fromContainerPixelToLatLng(pixelPoint);
          if (latLngPoint) {
            map.panTo(latLngPoint);
          }
        }
      }; 
      ov.draw = function() {}; 
      ov.setMap(map); 
    }
  }

  const activePointHandler = (id: number, position: IPosition) => {
    if (map) {
      if (id === activePoint) {
        setActivePoint(null);
      } else {
        setActivePoint(id);
        panToWithOffset(position, 0, -150)
      }
    }
  };

  return (
    <>
      <section className="map">
        {map && <MapNav map={map} points={points} setPoints={setPoints} activePointHandler={activePointHandler}/>}
        <div ref={ref} className='map__container'>
          {map && points && <MapPoints points={points} map={map} activePoint={activePoint} activePointHandler={activePointHandler}/>}
        </div>
      </section>

      <RoundFilter />
    </>
  )
}

export default MapComponent;
