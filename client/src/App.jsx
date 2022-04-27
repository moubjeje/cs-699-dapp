import { useState } from 'react'
import Login from './login/Login'
import Home from './home/Home'
import { initializeWeb3, resetWeb3 } from './api'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const handleLogin = (account) => {
        initializeWeb3(account)
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        resetWeb3()
        setIsLoggedIn(false)
    }
    return (
        <div>
            {isLoggedIn ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
        </div>
    );

}