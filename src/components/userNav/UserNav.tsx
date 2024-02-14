import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import './UserNav.css'

import Popup from '../popup/Popup'

export type UserNavProps = {
  profileToggle: boolean,
  setProfileToggle: (params: boolean) => void
}

const UserNav:React.FC<UserNavProps> = ({profileToggle, setProfileToggle}) => {
  const [exitPopup, setExitPopup] = useState(false);

  return (
    <>
      <aside className='user-nav'>
        <Link to='/map'><img src={logo} alt="Spot It" className='logo user-nav__logo'/></Link>
        <nav className='user-nav__list'>
          <Link to='/map' className='user-nav__item user-nav__item--map'>Карта</Link>
          <a className={profileToggle ? 'user-nav__item user-nav__item--profile' : 'user-nav__item user-nav__item--profile user-nav__item--active'} onClick={() => setProfileToggle(false)}>Профиль</a>
          <a className={profileToggle ? 'user-nav__item user-nav__item--points user-nav__item--active' : 'user-nav__item user-nav__item--points'} onClick={() => setProfileToggle(true)}>Мои точки</a>
        </nav>
        <a className='user-nav__item user-nav__item--exit' onClick={() => setExitPopup(true)}>Выйти из аккаунта</a>
      </aside>

      {exitPopup && <Popup>
        <h3 className='popup__title'>Вы уверены?</h3>
        <p className='description popup__description'>После выхода вам будет доступен только просмотр карты.</p>
        <div className='btns-group'>
          <a onClick={() => setExitPopup(false)} className='btn btn--outline'>Отмена</a>
          <Link to='/map' className='btn' onClick={() => {localStorage.removeItem("user");}}>Выйти</Link>
        </div>
      </Popup>}
    </>
  )
}

export default UserNav;
