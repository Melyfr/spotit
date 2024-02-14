import { IPointData } from '../../interfaces/IPoint'
import './PointCard.css'

type PointCardProps = {
    point: IPointData,
    activePoint: number | null
}

const PointCard:React.FC<PointCardProps> = ({point, activePoint}) => {
  return (
    <div className={point.id === activePoint ? 'point-card point-card-active' : 'point-card'}>
      <img src={point.img} alt={point.title} className='point-card__img'/>
      <div className="point-card__body">
        <h4 className='point-card__title'>{point.title}</h4>
        <p className='description point-card__adr'>{point.adr}</p>
        <ul className='point-card__tag-list'>
          {point.tags && Object.entries(point.tags).map(([index, data]) => (
            <li key={index} className='tag'>{data.title}</li>
          ))}
        </ul>
        <p className='description point-card__date'>{point.date}</p>
      </div>
    </div>
  )
}

export default PointCard;
