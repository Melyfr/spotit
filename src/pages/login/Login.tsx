import { useState } from 'react'
import './Login.css'

import Signin from '../../components/signin/Signin';
import Signup from '../../components/signup/Signup';

export type LoginProps = {
  setSignToggle: (params: boolean) => void
}

export default function Login() {
  const [signToggle, setSignToggle] = useState(false);

  return (
    <main className={signToggle ? 'login login--signup' : 'login login--signin'}>
      {signToggle ? <Signup setSignToggle={setSignToggle}/> : <Signin setSignToggle={setSignToggle}/>}
    </main>
  )
}
