import { useState } from 'react'
import Login from './login/Login'
import Home from './home/Home'

export default function App() {
    const [userAddress, setUserAddress] = useState(null);

    return (
        <div>
            {userAddress != null ? <Home handleLogout={() => setUserAddress(null)} /> : <Login handleLogin={(address) => setUserAddress(address)} />}
        </div>
    );

}