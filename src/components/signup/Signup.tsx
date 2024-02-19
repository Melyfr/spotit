import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios';
import { useState } from "react";

import { LoginProps } from '../../pages/login/Login'
import '../../pages/login/Login.css'
import './Signup.css'

type Inputs = {
  name: string,
  email: string,
  password: string,
  secondPassword: string
}

const Signup:React.FC<LoginProps> = ({setSignToggle}) => {
  const [error, setError] = useState('');
  const {register, watch, handleSubmit, formState: {errors}} = useForm<Inputs>();

  const onSubmit:SubmitHandler<Inputs> = (data) => {
    axios.post('https://spotit-back.onrender.com/signup', {name: data.name, email: data.email, pswrd: data.password})
    .then(() => {
      setSignToggle(false);
    }).catch((error) => {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    });
  };

  return (
    <section className={'signup login__item'}>
      <h2 className='title login__title'><a onClick={() => setSignToggle(false)} className='login__link'>Вход /</a> Регистрация</h2>
      <p className='description login__description'>Добро пожаловать! Пожалуйста, зарегестрируйте свой аккаунт.</p>
      <form className='login__form' onSubmit={handleSubmit(onSubmit)}>
        <label className='label'>
          Имя пользователя:
          <input type="text" className={errors.name ? 'input login__input input--error' : 'input login__input'} {...register('name', { required: true, minLength: 3})}/>
        </label>
        <label className='label'>
          Электронная почта:
          <input type="email" className={errors.email ? 'input login__input input--error' : 'input login__input'} {...register('email', { required: true})}/>
        </label>
        <label className='label'>
          Пароль:
          <input type='password' className={errors.password ? 'input login__input input--error' : 'input login__input'} {...register('password', { required: true, minLength: 8})}/>
        </label>
        <label className='label'>
          Повторите пароль:
          <input type='password' className={errors.secondPassword ? 'input login__input input--error' : 'input login__input'} {...register('secondPassword', { required: true, minLength: 8, validate: (value:string) => value === watch('password')})}/>
        </label>

        {(errors.name || errors.password || errors.secondPassword || error) && (
          <ul className="error login__error">
            {errors.name?.type === "minLength" && (
              <li>Ваше имя должно состоять из 3 или более символов.</li>
            )}

            {errors.name?.type === 'required' && (
              <li>Необходимо указать имя.</li>
            )}

            {errors.password?.type === 'minLength' && (
              <li>Ваш пароль должен состоять из 8 или более символов.</li>
            )}
            
            {errors.password?.type === 'required' && (
              <li>Необходимо указать пароль.</li>
            )}

            {errors.secondPassword?.type === 'validate' && (
              <li>Указанные пароли должны совпадать.</li>
            )}

            {error && (
              <li>{error}</li>
            )}
          </ul>
        )}

        <input type='submit' className='btn' value='Зарегистрироваться'/>
      </form>
      <p className='description login__notation'>Уже есть аккаунта? <a onClick={() => setSignToggle(false)} className='link'>Вход</a></p>
    </section>
  )
}

export default Signup;