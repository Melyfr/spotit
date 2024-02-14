import { useEffect, useRef } from 'react'
import { IPosition } from '../../interfaces/IPoint'
import { Root, createRoot } from 'react-dom/client'
import './MapPoint.css'

type MapPointProps = {
    map: google.maps.Map,
    position: IPosition,
    zIndex: number,
    onClick: (params: number, params2: IPosition) => void, 
    children: React.ReactNode
}

const MapPoint:React.FC<MapPointProps> = ({map, position, zIndex, onClick, children}) => {
    const pointRef = useRef<google.maps.marker.AdvancedMarkerElement>();
    const rootRef = useRef<Root>();
    
    useEffect(() => {
      if (!rootRef.current) {
        const container = document.createElement("div");
        rootRef.current = createRoot(container);
        
        pointRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          position, 
          content: container,
          zIndex: 1,
        });
      }
    }, []);
  
    useEffect(() => {
      if (rootRef.current && pointRef.current) {
        rootRef.current.render(children);
        pointRef.current.position = position;
        pointRef.current.map = map;
        pointRef.current.zIndex = zIndex;
        const listener = pointRef.current.addListener("click", onClick);
        return () => listener.remove();
      }
    }, [map, position, children]);

    return (
      <></>
    )
}

export default MapPoint;
