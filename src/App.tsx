import { Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Map from './pages/map/Map'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/map' element={<Map />} />
        <Route path='/' element={<Map />} />
        <Route path='*' element={<Map />} />
      </Routes>
    </div>
  )
}

export default App
