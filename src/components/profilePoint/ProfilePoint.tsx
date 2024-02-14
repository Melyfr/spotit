import { IPointData } from '../../interfaces/IPoint';
import './ProfilePoint.css'

type ProfilePointProps = {
  pointData: IPointData,
  setPointPopup: (params: number) => void
}

const ProfilePoint:React.FC<ProfilePointProps> = ({pointData, setPointPopup}) => {
  return (
    <li className='profile-point__item'>
      <p className='description profile-point__title'>{pointData.title}</p>
      <ul className='profile-point__tag-list'>
        {pointData.tags && Object.entries(pointData.tags).map(([index, tag]) => (
          <li key={index} className='tag profile-point__tag'>{tag.title}</li>
        ))}
      </ul>
      <p className='description profile-point__date'>{pointData.date}</p>
      <a className='profile-point__delete' onClick={() => setPointPopup(pointData.id)}></a>
    </li>
  )
}

export default ProfilePoint;
