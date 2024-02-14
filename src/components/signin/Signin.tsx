import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { LoginProps } from '../../pages/login/Login'
import '../../pages/login/Login.css'
import './Signin.css'


type Inputs = {
  name: string,
  password: string
}

const Signin:React.FC<LoginProps> = ({setSignToggle}) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}} = useForm<Inputs>();

  const onSubmit:SubmitHandler<Inputs> = (data) => {
    axios.post('http://localhost:5000/signin', {login: data.name, pswrd: data.password})
    .then(res => {
      localStorage.setItem("user", JSON.stringify(res.data));
      return navigate('/map');
    }).catch((error) => {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    });
  };

  return (
    <section className={'signin login__item'}>
      <h2 className='title login__title'>Вход <a onClick={() => setSignToggle(true)} className='login__link'>/ Регистрация</a></h2>
      <p className='description login__description'>Здравствуйте! Пожалуйста, войдите в свой аккаунт.</p>
      <form className='login__form' onSubmit={handleSubmit(onSubmit)}>
        <label className='label'>
          Имя пользователя:
          <input type="text"  className={errors.name ? 'input login__input input--error' : 'input login__input'} {...register('name', { required: true})}/>
        </label>
        <label className='label'>
          Пароль:
          <input type='password'  className={errors.password ? 'input login__input input--error' : 'input login__input'} {...register('password', { required: true})}/>
        </label>

        {(errors.name || errors.password || error) && (
          <ul className="error login__error">
            {errors.name?.type === 'required' && (
              <li>Необходимо указать имя.</li>
            )}

            {errors.password?.type === 'required' && (
              <li>Необходимо указать пароль.</li>
            )}

            {error && (
              <li>{error}</li>
            )}
          </ul>
        )}

        <input type='submit' className='btn' value='Войти'/>
      </form>
      <p className='description login__notation'>Еще нет аккаунта? <a onClick={() => setSignToggle(true)} className='link'>Регистрация</a></p>
    </section>
  )
}

export default Signin;