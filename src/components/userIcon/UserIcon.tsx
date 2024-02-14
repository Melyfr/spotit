import './UserIcon.css'

type UserIconProps = {
  userImg: string,
  isLogged: boolean
}

const UserIcon:React.FC<UserIconProps> = ({userImg, isLogged}) => {
  return (
    <img src={userImg} alt="User" className={isLogged ? 'user-icon user-icon--active' : 'user-icon'}/>
  )
}

export default UserIcon;
