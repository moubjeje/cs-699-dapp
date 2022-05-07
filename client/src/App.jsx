import { useState } from 'react'
import Login from './login/Login'
import Home from './home/Home'
import { initializeWeb3 } from './api'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const handleLogin = (account) => {
        initializeWeb3(account)
        setIsLoggedIn(true)
    }

    return (
        <div>
            {isLoggedIn ? <Home /> : <Login onLogin={handleLogin} />}
        </div>
    )

}