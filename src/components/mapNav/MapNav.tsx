import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAutocomplete from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

import IPoint, { IPosition, ITag } from '../../interfaces/IPoint'
import userImgPlaceholder from '../../assets/placeholder.svg'
import './MapNav.css'

import UserIcon from '../userIcon/UserIcon'
import Popup from '../popup/Popup'
import MapNavPoint from '../mapNavPoint/MapNavPoint';

type MapNavPoints = {
  map: google.maps.Map,
  points: IPoint | undefined,
  setPoints: (params: IPoint) => void,
  activePointHandler: (params: number, params2: IPosition) => void, 
}

const tags = [
  {title: 'Снег'},
  {title: 'Яма'},
  {title: 'Пандус'},
  {title: 'Ошибка проектирвоания'},
  {title: 'Лед'},
  {title: 'Разрушение'},
  {title: 'Погодные условия'},
  {title: 'Другое'},
];

const MapNav:React.FC<MapNavPoints> = ({map, points, setPoints, activePointHandler}) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userImg, setUserImg] = useState(userImgPlaceholder);
  const [signInPopup, setSignInPopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [pointsList, setPointsList] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formPosition, setFormPosition] = useState<IPosition | null>(null);
  const [formAddress, setFormAddress] = useState('')
  const [formImg, setFormImg] = useState<Blob | null>(null);
  const [formImgURL, setFormImgURL] = useState<string>();
  
  const geocoder = new window.google.maps.Geocoder();

  const {
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options: tags,
    getOptionLabel: (option) => option.title,
  });

  useEffect(() => {
    if (localStorage.getItem('user')) {
      axios.get(`http://localhost:5000/checkuser/${localStorage.getItem('user')}`)
      .then(res => {
        if (res.data.message != 'false') {
          setIsLogged(true);
          setUserImg(res.data);
        }
      })
    }
  }, []);

  const formClear = () => {
    setFormTitle('');
    setFormPosition(null);
    setFormAddress('');
    setFormImg(null);
    setFormImgURL('');
    setAddPopup(false);
  };

  const setPoisitionHandler = () => {
    setAddPopup(false);
    const listener = map.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
      if (mapsMouseEvent.latLng) {
        setFormPosition({lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng()});
        
        geocoder.geocode({ location: mapsMouseEvent.latLng}).then((response) => {
          if (response.results[0]) {
            let country = '', city = '', neighborhood = '';
            for (const result of response.results) {
              for (const component of result.address_components) {
                switch(component.types[0]) {
                  case 'country':
                    country = component.long_name;
                    break;
                  case 'locality':
                    city = component.long_name;
                    break;
                  case 'political':
                    neighborhood = component.long_name;
                    break;
                  default:
                    break;
                }
              }
            }
            setFormAddress(`${country}, ${city}, ${neighborhood}`);
            setAddPopup(true);
          }
        });
      }
    });

    return () => {
      listener.remove();
    };
  };

  const imageChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files && event.target.files[0]) {
      setFormImg(event.target.files[0]);
      setFormImgURL(URL.createObjectURL(event.target.files[0]));
    }
  };

  const submitHandler = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formTitle && value.length > 0 && formAddress && formPosition && formImgURL && formImg) {
      const date = new Date();
      const newPoint = {
        title: formTitle,
        position: formPosition,
        tags: value,
        adr: formAddress,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        img: formImgURL,
        author: localStorage.getItem('user'),
      };

      const pointData = new FormData();
      pointData.append('data', JSON.stringify(newPoint));
      pointData.append('file', formImg);

      axios.post('http://localhost:5000/addpoint', pointData).then((res) => {
        setPoints(JSON.parse(res.data));
      }).catch((error) => {
        console.error(error);
      });

      formClear();
    } 
  };

  return (
    <>
      <div className='map-nav'>
        <div className='map-nav__controle'>
          <label className='map-nav__label'>
            <input type="text" placeholder='Поиск адреса' className='input map-nav__input'/>
          </label>
          <a className={pointsList ? 'map-nav__list-btn map-nav__list-btn--active' : 'map-nav__list-btn'} onClick={() => setPointsList(!pointsList)}></a>
          {isLogged
            ? <Link to='/profile'><UserIcon userImg={userImg} isLogged={isLogged}/></Link> 
            : <a onClick={() => setSignInPopup(true)}><UserIcon userImg={userImg} isLogged={isLogged}/></a>
          }
        </div>

        <div className={pointsList ? 'scrollbar map-nav__points map-nav__points--active' : 'scrollbar map-nav__points'}>
          <h3 className='map-nav__points__title'>Недавние точки:</h3>
          <ul className="map-nav__points-list scrollbar">
            {points && Object.entries(points).map(([key, point]) => (
              <MapNavPoint key={key} point={point} activePointHandler={activePointHandler}/>
            ))}
          </ul>
        </div>
      </div>

      <a className='map-nav__add-btn' onClick={() => {isLogged ? setAddPopup(true) : setSignInPopup(true)}}></a>

      {signInPopup && <Popup>
        <h3 className='popup__title'>Вход / Регистрация</h3>
        <p className='description popup__description'>Чтобы выполнить это действие вам нужно войти в свой аккаунт или зарегестрироваться.</p>
        <div className='btns-group map-nav__btns-group'>
          <a onClick={() => setSignInPopup(false)} className='btn btn--outline'>Отмена</a>
            <Link to='/login' className='btn'>Вход</Link>
            <Link to='/registration' className='btn'>Регистарция</Link>
        </div>
      </Popup>}

      <div className={addPopup ? 'add-popup add-popup--active' : 'add-popup'}>
        <Popup>
          <h2 className='title add-popup__title'>Добавить точку</h2>
          <p className="description add-popup__description">
            Следуйте указаниям и заполните все поля, чтобы добавить свою точку на карту. 
          </p>
          <form className='add-popup__form' onSubmit={submitHandler}>

            <label className='label'>
              Название точки:
              <input type="text" className='input add-popup__input' value={formTitle} onChange={(event) => setFormTitle(event.target.value)}/>
            </label>

            <label className='label'>
              Метки:
              <div className='scrollbar add-popup__tags' ref={setAnchorEl}>
                {value.map((option: ITag, index: number) => (
                  <Tag label={option.title} {...getTagProps({ index })} />
                ))}
                <input className='input add-popup__input add-popup__input--tags' {...getInputProps()} />
              </div>
              {groupedOptions.length > 0 ? (
                <ul className='scrollbar add-popup__list' {...getListboxProps()}>
                  {(groupedOptions as ITag[]).map((option, index) => (
                    <li key={index} className='add-popup__list__item' {...getOptionProps({ option, index })}>
                      <span className='add-popup__list__title'>{option.title}</span>
                      <CheckIcon className='add-popup__list__icon' fontSize="small" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </label>

            <label className='label'>
              Место:
              <input type="text" className='input add-popup__input' required disabled value={formAddress} name='position'/>
              <a onClick={setPoisitionHandler} className='link add-popup__link'>Указать на карте</a>
            </label>

            <div className='label'>
              Фотография:
              <input type="file" id='add-popup__img' className='add-popup__input--img' required onChange={(event) => imageChangeHandler(event)}/>
              {formImg ?  <img src={formImgURL} alt="Ваше изображение" className='add-popup__input add-popup__img'/> : <div className='add-popup__input add-popup__placeholder'></div>}
              <label htmlFor="add-popup__img" className='link add-popup__link'>Выбрать файл</label>
            </div>

            <div className='btns-group'>
              <a onClick={formClear} className='btn btn--outline'>Отмена</a>
              <input type='submit' value='Добавить' className='btn'/>
            </div>
          </form>
        </Popup>
      </div>
    </>
  )
}

type TagProps = {
  label: string,
  key: number,
  'data-tag-index': number,
  tabIndex: -1,
  onDelete: (event: any) => void
}

const Tag:React.FC<TagProps> = (props) => {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other} className='add-popup__tag'>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

export default MapNav;

