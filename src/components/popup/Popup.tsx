import './Popup.css'

type PopupProps = {
  children:React.ReactNode
}

const Popup:React.FC<PopupProps>  = ({children}) => {
  return (
    <div className='popup__overlay'>
      <div className="popup">
        {children}
      </div>
    </div>
  )
}

export default Popup;
