import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IPoint from '../../interfaces/IPoint';
import './UserPoints.css'

import ProfilePoint from '../profilePoint/ProfilePoint';
import Popup from '../popup/Popup';

const UserPoints = () => {
  const [points, setPoints] = useState<IPoint>();
  const [pointPopup, setPointPopup] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      axios.get(`https://spotit-back.onrender.com/getpointsprofile/${localStorage.getItem('user')}`)
        .then(res => {
          setPoints(JSON.parse(res.data));
      }).catch((error) => {
        console.error(error);
      });
    } else {
      return navigate('/login');
    }
  }, []);

  const deleteHandler = (pointID: number) => {
    if (points) {
      const newPoints = points;
      const img = newPoints[pointID].img.split('/');
      const imgName = img[img.length - 1];
      axios.post('https://spotit-back.onrender.com/delpoint', {deleteID: pointID, userID: localStorage.getItem('user'), img: imgName});
      delete newPoints[pointID];
      setPointPopup(0);
      setPoints({...newPoints});
    }
  }

  return (
    <>
      <section className='profile__item'>
        <h2 className='title profile__title'>Мои точки</h2>
        <p className='description profile__description'>Здесь можно увидеть ваши активные точки и удалить их.</p>
        <ul className='profile__item__body user-points__list scrollbar'>
          {points && Object.entries(points).length > 0 ? Object.entries(points).map(([id, pointData]) => (
            <ProfilePoint key={id} pointData={pointData} setPointPopup={setPointPopup}/>
          )) : <p className='description user-points__null'>Сейчас у вас нет активных точек.</p>}
        </ul>
      </section>

      {pointPopup ? 
        <Popup>
          <h3 className='popup__title'>Вы уверены?</h3>
          <p className='description popup__description'>После удаления точки вы не сможете ее восстановить.</p>
          <div className='btns-group'>
            <a onClick={() => setPointPopup(0)} className='btn btn--outline'>Отмена</a>
            <a onClick={() => deleteHandler(pointPopup)} className='btn'>Удалить</a>
          </div>
      </Popup>
      :''}
    </>
  )
}

export default UserPoints;