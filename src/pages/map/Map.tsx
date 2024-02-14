import { Wrapper, Status} from "@googlemaps/react-wrapper";
import './Map.css'

import MapComponent from "../../components/mapComponent/MapComponent";


export default function Map() {
  const render = (status: Status) => {
    if (status === Status.FAILURE) return <p>Error loading map</p>;
    return <p>Loading map</p>;
  };

  return (
    <Wrapper apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY} version="beta" libraries={["places", "marker"]} render={render}>
      <MapComponent />
    </Wrapper>
  )
}
