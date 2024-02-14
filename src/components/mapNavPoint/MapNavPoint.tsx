import { IPointData, IPosition } from '../../interfaces/IPoint'
import './MapNavPoint.css'

type MapNavPointProps = {
    point: IPointData,
    activePointHandler: (params: number, params2: IPosition) => void
}

const MapNavPoint:React.FC<MapNavPointProps> = ({point, activePointHandler}) => {
  return (
    <li className="nav-point" onClick={() => activePointHandler(point.id, point.position)}>
        <img src={point.img} alt={point.title} className="nav-point__img" />
        <div className="nav-point__content">
            <p className="description nav-point__title">{point.title}</p>
            <ul className='nav-point__tag-list'>
                {point.tags && Object.entries(point.tags).map(([index, tag]) => (
                  <li key={index} className='tag nav-point__tag'>{tag.title}</li>
                ))}
            </ul>
            <p className='description nav-point__date'>{point.date}</p>
        </div>
    </li>
  )
}

export default MapNavPoint;