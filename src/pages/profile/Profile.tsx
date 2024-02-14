import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import userImgPlaceholder from '../../assets/placeholder.svg'
import './Profile.css'

import UserIcon from '../../components/userIcon/UserIcon';
import UserNav from '../../components/userNav/UserNav'
import UserData from '../../components/userData/UserData';
import UserPoints from '../../components/userPoints/UserPoints';
import axios from 'axios';

export default function Profile() {
  const [profileToggle, setProfileToggle] = useState(false);
  const [userImg, setUserImg] = useState(userImgPlaceholder);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      axios.get(`http://localhost:5000/checkuser/${localStorage.getItem('user')}`)
      .then(res => {
        if (res.data.message === 'false') {
          localStorage.removeItem("user");
          return navigate('/login');
        } else {
          setUserImg(res.data);
        }
      })
    } else {
      return navigate('/login');
    }
  }, []);

  return (
    <main className='profile'>
      <UserNav profileToggle={profileToggle} setProfileToggle={setProfileToggle}/>
      {profileToggle ? <UserPoints /> : <UserData setUserImgProp = {setUserImg}/>}
      <Link to='/profile'><UserIcon userImg={userImg} isLogged={true}/></Link>
    </main>
  )
}
