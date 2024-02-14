import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userPlaceholder from '../../assets/placeholder.svg';
import './UserData.css'

import Popup from '../popup/Popup';

type Inputs = {
  name: string,
  email: string,
  newPassword: string,
  secondNewPassword: string,
  password: string
}

type UserDataProps = {
  setUserImgProp: (params: string) => void
}

const UserData:React.FC<UserDataProps> = ({setUserImgProp}) => {
  const [userImg, setUserImg] = useState<File | null>(null);
  const [userImgURL, setUserImgURL] = useState(userPlaceholder);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [accountPopup, setAccountPopup] = useState(false);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<Inputs>();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      axios.get(`http://localhost:5000/getuser/${localStorage.getItem('user')}`)
      .then(res => {
        setUserName(JSON.parse(res.data)[0].name);
        setUserEmail(JSON.parse(res.data)[0].email);
        setUserImgURL(JSON.parse(res.data)[0].img)
    }).catch((error) => {
      console.error(error);
    });
    } else {
      return navigate('/login');
    }
  }, []);

  const onSubmit:SubmitHandler<Inputs> = (data) => {
    const newUserData = new FormData();
    newUserData.append('authKey', String(localStorage.getItem('user')));
    newUserData.append('pswrd', data.password);
    newUserData.append('name', data.name);
    newUserData.append('email', data.email);
    newUserData.append('newpswrd', data.newPassword);
    newUserData.append('file', userImg ? userImg : '');

    axios.post(`http://localhost:5000/savechanges`, newUserData)
    .then(() => {
      if (data.name) setUserName(data.name);
      if (data.email) setUserEmail(data.email);
      setError('');
    })
    .catch((error) => {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    });
  };

  const imageChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files && event.target.files[0]) {
      setUserImg(event.target.files[0]);
      setUserImgURL(URL.createObjectURL(event.target.files[0]));
      setUserImgProp(URL.createObjectURL(event.target.files[0]));
    }
  };

  const accountDeleteHandler = () => {
    if (watch('password')) {
      axios.post(`http://localhost:5000/delete`, {authKey: localStorage.getItem('user'), pswrd: watch('password')})
      .then(res => {
        if (res.status === 200) {
          localStorage.removeItem("user");
          return navigate('/login');
        }
      }).catch((error) => {
        console.log(error.response.data.message);
        setError(error.response.data.message);
      });
    } else {
      setError('Введите текущий пароль.');
    }
  };

  return (
    <>
      <section className='profile__item'>
        <h2 className='title profile__title'>Профиль</h2>
        <p className='description profile__description'>Здесь можно посмотреть и изменить данные аккаунта.</p>
        <form className='profile__item__body user-data__body' onSubmit={handleSubmit(onSubmit)}>
          <div className='user-data__img'>
            <img src={userImgURL} alt="User" className='user-icon user-icon--active user-data__img__icon'/>
            <label className='user-data__img__label'>
              <input type="file" className='user-data__img__input' onChange={(event) => imageChangeHandler(event)}/>
            </label>
            <span className='user-data__name'>{userName}</span>
          </div>
          <div className='user-data__inputs'>
            <label className='label'>
              Имя пользователя:
              <input type="text" className={errors.name ? 'input input--error user-data__input' : 'input user-data__input'} placeholder={userName} {...register('name', {minLength: 3})}/>
            </label>
            <label className='label'>
              Электронная почта:
              <input type="email" className='input user-data__input' placeholder={userEmail} {...register('email')}/>
            </label>
            <label className='label'>
              Новый пароль:
              <input type="password" className={errors.newPassword ? 'input input--error user-data__input' : 'input user-data__input'} {...register('newPassword', {minLength: 8})}/>
            </label>
            <label className='label'>
              Повторите новый пароль:
              <input type="password" className={errors.secondNewPassword ? 'input input--error user-data__input' : 'input user-data__input'} {...register('secondNewPassword', {minLength: 8, validate: (value:string) => value === watch('newPassword')})}/>
            </label>
            <label className='label'>
              Текущий пароль: 
              <input type="password" className={errors.password ? 'input input--error user-data__input' : 'input user-data__input'} {...register('password', { required: true})}/>
            </label>
            <input type="submit" value='Сохранить изменения' className='btn user-data__btn'/>
            <a className='btn btn--outline user-data__btn' onClick={() => setAccountPopup(true)}>Удалить аккаунт</a>
          </div>
          {(errors.name || errors.newPassword || errors.secondNewPassword || errors.password || error) && (
            <ul className="error user-data__error">
              {errors.name?.type === "minLength" && (
                <li>Ваше имя должно состоять из 3 или более символов.</li>
              )}

              {errors.newPassword?.type === 'minLength' && (
                <li>Ваш пароль должен состоять из 8 или более символов.</li>
              )}
              
              {errors.secondNewPassword?.type === 'validate' && (
                <li>Указанные пароли должны совпадать.</li>
              )}

              {errors.password?.type === 'required' && (
                <li>Необходимо указать текущий пароль.</li>
              )}

              {error && (
                <li>{error}</li>
              )}
            </ul>
          )}
        </form>
      </section>

      {accountPopup && 
        <Popup>
          <h3 className='popup__title'>Вы уверены?</h3>
          <p className='description popup__description'>После удаления аккаунта вы не сможете его восстановить и все ваши точки удалятся.</p>
          <div className='btns-group'>
            <a onClick={() => setAccountPopup(false)} className='btn btn--outline'>Отмена</a>
            <a onClick={accountDeleteHandler} className='btn'>Удалить</a>
          </div>
        </Popup>
      }
    </>
  )
}

export default UserData;