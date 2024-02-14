import IPoint, { IPosition } from '../../interfaces/IPoint'
import './MapPoints.css'

import MapPoint from '../mapPoint/MapPoint'
import PointCard from '../pointCard/PointCard'

type MapPointsProps = {
  points: IPoint,
  map: google.maps.Map,
  activePoint: number | null,
  activePointHandler: (params: number, params2: IPosition) => void, 
}

const MapPoints:React.FC<MapPointsProps> = ({points, map, activePoint, activePointHandler}) => {
  return (
    <>
      {points && Object.entries(points).map(([key, point]) => (
        <MapPoint key={key} map={map} position={point.position} zIndex={activePoint === point.id ? 2 : 1} onClick={() => activePointHandler(point.id, point.position)}> 
          <div className="map-point"/>
          <PointCard point={point} activePoint={activePoint}/>
        </MapPoint>
      ))}
    </>
  )
}

export default MapPoints;